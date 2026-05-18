package com.cashflow.backend.analytics;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import com.cashflow.backend.analytics.dto.AnalyticsSummaryResponse;
import com.cashflow.backend.analytics.dto.CategoryBreakdown;
import com.cashflow.backend.analytics.dto.MonthlyBalancePoint;
import com.cashflow.backend.analytics.dto.WeeklySpendingPoint;
import com.cashflow.backend.budget.Budget;
import com.cashflow.backend.budget.BudgetRepository;
import com.cashflow.backend.transaction.CategoryTotal;
import com.cashflow.backend.transaction.Transaction;
import com.cashflow.backend.transaction.TransactionRepository;
import com.cashflow.backend.transaction.TransactionType;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {
	private final TransactionRepository transactionRepository;
	private final BudgetRepository budgetRepository;

	public AnalyticsService(TransactionRepository transactionRepository,
			BudgetRepository budgetRepository) {
		this.transactionRepository = transactionRepository;
		this.budgetRepository = budgetRepository;
	}

	public AnalyticsSummaryResponse getSummary(UUID userId, LocalDate month) {
		LocalDate[] range = monthRange(month);
		BigDecimal income = transactionRepository.sumByUserAndTypeAndDateBetween(
				userId, TransactionType.INCOME, range[0], range[1]);
		BigDecimal expenses = transactionRepository.sumByUserAndTypeAndDateBetween(
				userId, TransactionType.EXPENSE, range[0], range[1]);
		BigDecimal savings = income.subtract(expenses);
		BigDecimal budgetUsage = calculateBudgetUsage(userId, range[0]);

		return new AnalyticsSummaryResponse(savings, income, expenses, savings, budgetUsage);
	}

	public List<MonthlyBalancePoint> getMonthlyBalance(UUID userId, int months) {
		int cappedMonths = Math.max(3, Math.min(months, 12));
		YearMonth end = YearMonth.now();
		YearMonth start = end.minusMonths(cappedMonths - 1L);
		LocalDate from = start.atDay(1);
		LocalDate to = end.atEndOfMonth();

		List<Transaction> transactions = transactionRepository.findByUser_IdAndDateBetween(
				userId, from, to);
		Map<YearMonth, List<Transaction>> grouped = transactions.stream()
				.collect(Collectors.groupingBy(tx -> YearMonth.from(tx.getDate())));

		List<MonthlyBalancePoint> result = new ArrayList<>();
		YearMonth cursor = start;
		while (!cursor.isAfter(end)) {
			List<Transaction> items = grouped.getOrDefault(cursor, List.of());
			BigDecimal income = sumByType(items, TransactionType.INCOME);
			BigDecimal expense = sumByType(items, TransactionType.EXPENSE);
			result.add(new MonthlyBalancePoint(cursor.toString(), income, expense,
					income.subtract(expense)));
			cursor = cursor.plusMonths(1);
		}
		return result;
	}

	public List<WeeklySpendingPoint> getWeeklySpending(UUID userId, int days) {
		int cappedDays = Math.max(7, Math.min(days, 14));
		LocalDate end = LocalDate.now();
		LocalDate start = end.minusDays(cappedDays - 1L);
		List<Transaction> transactions = transactionRepository.findByUser_IdAndDateBetween(
				userId, start, end);
		Map<LocalDate, BigDecimal> totals = transactions.stream()
				.filter(tx -> tx.getType() == TransactionType.EXPENSE)
				.collect(Collectors.groupingBy(Transaction::getDate,
						Collectors.mapping(Transaction::getAmount,
								Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));

		List<WeeklySpendingPoint> result = new ArrayList<>();
		LocalDate cursor = start;
		while (!cursor.isAfter(end)) {
			result.add(new WeeklySpendingPoint(cursor.toString(),
					totals.getOrDefault(cursor, BigDecimal.ZERO)));
			cursor = cursor.plusDays(1);
		}
		return result;
	}

	public List<CategoryBreakdown> getCategoryBreakdown(UUID userId, LocalDate month) {
		LocalDate[] range = monthRange(month);
		List<CategoryTotal> totals = transactionRepository.sumByCategory(
				userId, TransactionType.EXPENSE, range[0], range[1]);
		BigDecimal totalExpense = totals.stream()
				.map(CategoryTotal::getTotal)
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		return totals.stream()
				.map(total -> new CategoryBreakdown(
					total.getCategory(),
					total.getTotal(),
					calculateShare(total.getTotal(), totalExpense)))
				.toList();
	}

	private LocalDate[] monthRange(LocalDate month) {
		LocalDate normalized = month == null ? LocalDate.now() : month;
		YearMonth yearMonth = YearMonth.from(normalized);
		return new LocalDate[] { yearMonth.atDay(1), yearMonth.atEndOfMonth() };
	}

	private BigDecimal sumByType(List<Transaction> items, TransactionType type) {
		return items.stream()
				.filter(tx -> tx.getType() == type)
				.map(Transaction::getAmount)
				.reduce(BigDecimal.ZERO, BigDecimal::add);
	}

	private BigDecimal calculateShare(BigDecimal part, BigDecimal total) {
		if (total.compareTo(BigDecimal.ZERO) == 0) {
			return BigDecimal.ZERO;
		}
		return part.divide(total, 4, RoundingMode.HALF_UP)
				.multiply(BigDecimal.valueOf(100))
				.setScale(2, RoundingMode.HALF_UP);
	}

	private BigDecimal calculateBudgetUsage(UUID userId, LocalDate month) {
		LocalDate normalizedMonth = month.withDayOfMonth(1);
		List<Budget> budgets = budgetRepository.findByUser_IdAndMonth(userId, normalizedMonth);
		if (budgets.isEmpty()) {
			return BigDecimal.ZERO;
		}

		YearMonth yearMonth = YearMonth.from(normalizedMonth);
		LocalDate start = yearMonth.atDay(1);
		LocalDate end = yearMonth.atEndOfMonth();
		Map<String, BigDecimal> totals = transactionRepository.sumByCategory(
				userId, TransactionType.EXPENSE, start, end)
				.stream()
				.collect(Collectors.toMap(CategoryTotal::getCategory, CategoryTotal::getTotal));

		BigDecimal totalBudget = budgets.stream()
				.map(Budget::getAmount)
				.reduce(BigDecimal.ZERO, BigDecimal::add);
		BigDecimal spent = budgets.stream()
				.map(budget -> totals.getOrDefault(budget.getCategory(), BigDecimal.ZERO))
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		if (totalBudget.compareTo(BigDecimal.ZERO) == 0) {
			return BigDecimal.ZERO;
		}
		return spent.divide(totalBudget, 4, RoundingMode.HALF_UP)
				.multiply(BigDecimal.valueOf(100))
				.setScale(2, RoundingMode.HALF_UP);
	}
}
