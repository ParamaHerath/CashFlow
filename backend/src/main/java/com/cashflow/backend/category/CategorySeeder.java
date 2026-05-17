package com.cashflow.backend.category;

import java.util.List;

import com.cashflow.backend.user.User;
import org.springframework.stereotype.Service;

@Service
public class CategorySeeder {
	private static final List<SeedCategory> DEFAULT_CATEGORIES = List.of(
			new SeedCategory("Food", "#F59E0B", "utensils"),
			new SeedCategory("Transport", "#3B82F6", "car"),
			new SeedCategory("Bills", "#6366F1", "receipt"),
			new SeedCategory("Entertainment", "#EC4899", "film"),
			new SeedCategory("Shopping", "#8B5CF6", "shopping-bag"),
			new SeedCategory("Salary", "#10B981", "wallet"),
			new SeedCategory("Investments", "#0EA5E9", "trending-up"),
			new SeedCategory("Health", "#F97316", "heart-pulse"),
			new SeedCategory("Education", "#22C55E", "graduation-cap"),
			new SeedCategory("Other", "#64748B", "shapes")
	);

	private final CategoryRepository categoryRepository;

	public CategorySeeder(CategoryRepository categoryRepository) {
		this.categoryRepository = categoryRepository;
	}

	public void seedDefaults(User user) {
		if (categoryRepository.existsByUser_Id(user.getId())) {
			return;
		}

		List<Category> categories = DEFAULT_CATEGORIES.stream()
				.map(seed -> buildCategory(user, seed))
				.toList();
		categoryRepository.saveAll(categories);
	}

	private Category buildCategory(User user, SeedCategory seed) {
		Category category = new Category();
		category.setUser(user);
		category.setName(seed.name());
		category.setColor(seed.color());
		category.setIcon(seed.icon());
		return category;
	}

	private record SeedCategory(String name, String color, String icon) {}
}
