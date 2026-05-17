package com.cashflow.backend.category;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import com.cashflow.backend.category.dto.CategoryRequest;
import com.cashflow.backend.category.dto.CategoryResponse;
import com.cashflow.backend.category.dto.CategoryUpdateRequest;
import com.cashflow.backend.common.exception.ConflictException;
import com.cashflow.backend.common.exception.ResourceNotFoundException;
import com.cashflow.backend.transaction.CategoryTotal;
import com.cashflow.backend.transaction.TransactionRepository;
import com.cashflow.backend.transaction.TransactionType;
import com.cashflow.backend.user.User;
import com.cashflow.backend.user.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {
	private final CategoryRepository categoryRepository;
	private final UserRepository userRepository;
	private final TransactionRepository transactionRepository;

	public CategoryService(CategoryRepository categoryRepository,
			UserRepository userRepository,
			TransactionRepository transactionRepository) {
		this.categoryRepository = categoryRepository;
		this.userRepository = userRepository;
		this.transactionRepository = transactionRepository;
	}

	public List<CategoryResponse> list(UUID userId, LocalDate from, LocalDate to) {
		LocalDate[] range = resolveRange(from, to);
		LocalDate start = range[0];
		LocalDate end = range[1];

		List<Category> categories = categoryRepository.findByUser_IdOrderByNameAsc(userId);
		Map<String, BigDecimal> totalsByCategory = transactionRepository
				.sumByCategory(userId, TransactionType.EXPENSE, start, end)
				.stream()
				.collect(Collectors.toMap(CategoryTotal::getCategory, CategoryTotal::getTotal));

		BigDecimal totalExpense = transactionRepository
				.sumByUserAndTypeAndDateBetween(userId, TransactionType.EXPENSE, start, end);

		return categories.stream()
				.map(category -> {
					BigDecimal monthlyTotal = totalsByCategory
							.getOrDefault(category.getName(), BigDecimal.ZERO);
					BigDecimal share = calculateShare(monthlyTotal, totalExpense);
					return CategoryResponse.from(category, monthlyTotal, share);
				})
				.toList();
	}

	public CategoryResponse create(UUID userId, CategoryRequest request) {
		String name = request.name().trim();
		if (categoryRepository.existsByUser_IdAndNameIgnoreCase(userId, name)) {
			throw new ConflictException("Category already exists");
		}
		User user = userRepository.getReferenceById(userId);
		Category category = new Category();
		category.setUser(user);
		category.setName(name);
		category.setColor(request.color());
		category.setIcon(request.icon());
		Category saved = categoryRepository.save(category);
		return CategoryResponse.from(saved, BigDecimal.ZERO, BigDecimal.ZERO);
	}

	public CategoryResponse update(UUID userId, UUID categoryId, CategoryUpdateRequest request) {
		Category category = categoryRepository.findByIdAndUser_Id(categoryId, userId)
				.orElseThrow(() -> new ResourceNotFoundException("Category not found"));
		String name = request.name().trim();
		if (!category.getName().equalsIgnoreCase(name)
				&& categoryRepository.existsByUser_IdAndNameIgnoreCase(userId, name)) {
			throw new ConflictException("Category already exists");
		}
		category.setName(name);
		category.setColor(request.color());
		category.setIcon(request.icon());
		Category saved = categoryRepository.save(category);
		return CategoryResponse.from(saved, BigDecimal.ZERO, BigDecimal.ZERO);
	}

	public void delete(UUID userId, UUID categoryId) {
		Category category = categoryRepository.findByIdAndUser_Id(categoryId, userId)
				.orElseThrow(() -> new ResourceNotFoundException("Category not found"));
		categoryRepository.delete(category);
	}

	private LocalDate[] resolveRange(LocalDate from, LocalDate to) {
		if (from != null && to != null) {
			return new LocalDate[] { from, to };
		}
		LocalDate today = LocalDate.now();
		LocalDate start = today.withDayOfMonth(1);
		LocalDate end = today.withDayOfMonth(today.lengthOfMonth());
		return new LocalDate[] { start, end };
	}

	private BigDecimal calculateShare(BigDecimal part, BigDecimal total) {
		if (total == null || total.compareTo(BigDecimal.ZERO) == 0) {
			return BigDecimal.ZERO;
		}
		return part
				.divide(total, 4, RoundingMode.HALF_UP)
				.multiply(BigDecimal.valueOf(100))
				.setScale(2, RoundingMode.HALF_UP);
	}
}
