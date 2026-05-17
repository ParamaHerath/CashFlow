package com.cashflow.backend.budget;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import com.cashflow.backend.budget.dto.BudgetRequest;
import com.cashflow.backend.budget.dto.BudgetResponse;
import com.cashflow.backend.budget.dto.BudgetUpdateRequest;
import com.cashflow.backend.common.exception.ConflictException;
import com.cashflow.backend.common.exception.ResourceNotFoundException;
import com.cashflow.backend.transaction.CategoryTotal;
import com.cashflow.backend.transaction.TransactionRepository;
import com.cashflow.backend.transaction.TransactionType;
import com.cashflow.backend.user.User;
import com.cashflow.backend.user.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class BudgetService {
	private final BudgetRepository budgetRepository;
	private final UserRepository userRepository;
	private final TransactionRepository transactionRepository;

	public BudgetService(BudgetRepository budgetRepository,
			UserRepository userRepository,
			TransactionRepository transactionRepository) {
		this.budgetRepository = budgetRepository;
		this.userRepository = userRepository;
		this.transactionRepository = transactionRepository;
	}

	public List<BudgetResponse> list(UUID userId, LocalDate month) {
		LocalDate normalizedMonth = normalizeMonth(month);
		YearMonth yearMonth = YearMonth.from(normalizedMonth);
		LocalDate start = yearMonth.atDay(1);
		LocalDate end = yearMonth.atEndOfMonth();

		List<Budget> budgets = budgetRepository.findByUser_IdAndMonth(userId, normalizedMonth);
		Map<String, BigDecimal> spentByCategory = transactionRepository
				.sumByCategory(userId, TransactionType.EXPENSE, start, end)
				.stream()
				.collect(Collectors.toMap(CategoryTotal::getCategory, CategoryTotal::getTotal));

		return budgets.stream()
				.map(budget -> buildResponse(budget,
						spentByCategory.getOrDefault(budget.getCategory(), BigDecimal.ZERO)))
				.toList();
	}

	public BudgetResponse create(UUID userId, BudgetRequest request) {
		LocalDate normalizedMonth = normalizeMonth(request.month());
		String category = request.category().trim();
		if (budgetRepository.existsByUser_IdAndCategoryIgnoreCaseAndMonth(userId, category,
				normalizedMonth)) {
			throw new ConflictException("Budget already exists for this category and month");
		}
		User user = userRepository.getReferenceById(userId);
		Budget budget = new Budget();
		budget.setUser(user);
		budget.setCategory(category);
		budget.setAmount(request.amount());
		budget.setMonth(normalizedMonth);
		Budget saved = budgetRepository.save(budget);
		return buildResponse(saved, BigDecimal.ZERO);
	}

	public BudgetResponse update(UUID userId, UUID budgetId, BudgetUpdateRequest request) {
		Budget budget = budgetRepository.findByIdAndUser_Id(budgetId, userId)
				.orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
		LocalDate normalizedMonth = normalizeMonth(request.month());
		String category = request.category().trim();
		boolean changedKey = !budget.getCategory().equalsIgnoreCase(category)
				|| !budget.getMonth().equals(normalizedMonth);
		if (changedKey && budgetRepository.existsByUser_IdAndCategoryIgnoreCaseAndMonth(
				userId, category, normalizedMonth)) {
			throw new ConflictException("Budget already exists for this category and month");
		}
		budget.setCategory(category);
		budget.setAmount(request.amount());
		budget.setMonth(normalizedMonth);
		Budget saved = budgetRepository.save(budget);
		return buildResponse(saved, BigDecimal.ZERO);
	}

	public void delete(UUID userId, UUID budgetId) {
		Budget budget = budgetRepository.findByIdAndUser_Id(budgetId, userId)
				.orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
		budgetRepository.delete(budget);
	}

	private BudgetResponse buildResponse(Budget budget, BigDecimal spent) {
		BigDecimal remaining = budget.getAmount().subtract(spent).max(BigDecimal.ZERO);
		BigDecimal usagePercent = BigDecimal.ZERO;
		if (budget.getAmount().compareTo(BigDecimal.ZERO) > 0) {
			usagePercent = spent.divide(budget.getAmount(), 4, RoundingMode.HALF_UP)
					.multiply(BigDecimal.valueOf(100))
					.setScale(2, RoundingMode.HALF_UP);
		}
		return BudgetResponse.from(budget, spent, remaining, usagePercent);
	}

	private LocalDate normalizeMonth(LocalDate month) {
		LocalDate value = month == null ? LocalDate.now() : month;
		return value.withDayOfMonth(1);
	}
}
