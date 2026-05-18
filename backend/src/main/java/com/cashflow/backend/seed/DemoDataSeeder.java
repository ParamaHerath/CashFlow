package com.cashflow.backend.seed;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import com.cashflow.backend.budget.Budget;
import com.cashflow.backend.budget.BudgetRepository;
import com.cashflow.backend.category.CategorySeeder;
import com.cashflow.backend.transaction.Transaction;
import com.cashflow.backend.transaction.TransactionRepository;
import com.cashflow.backend.transaction.TransactionType;
import com.cashflow.backend.user.Role;
import com.cashflow.backend.user.User;
import com.cashflow.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(prefix = "app.seed", name = "enabled", havingValue = "true")
public class DemoDataSeeder implements CommandLineRunner {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final CategorySeeder categorySeeder;
	private final TransactionRepository transactionRepository;
	private final BudgetRepository budgetRepository;

	@Value("${app.seed.demo-email:demo@cashflow.app}")
	private String demoEmail;

	@Value("${app.seed.demo-password:Password123!}")
	private String demoPassword;

	public DemoDataSeeder(UserRepository userRepository,
			PasswordEncoder passwordEncoder,
			CategorySeeder categorySeeder,
			TransactionRepository transactionRepository,
			BudgetRepository budgetRepository) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.categorySeeder = categorySeeder;
		this.transactionRepository = transactionRepository;
		this.budgetRepository = budgetRepository;
	}

	@Override
	public void run(String... args) {
		User user = userRepository.findByEmail(demoEmail)
				.orElseGet(() -> createDemoUser());
		categorySeeder.seedDefaults(user);

		if (!transactionRepository.existsByUser_Id(user.getId())) {
			seedTransactions(user);
		}

		LocalDate month = YearMonth.now().atDay(1);
		if (!budgetRepository.existsByUser_IdAndMonth(user.getId(), month)) {
			seedBudgets(user, month);
		}
	}

	private User createDemoUser() {
		User user = new User();
		user.setFullName("Demo User");
		user.setEmail(demoEmail);
		user.setPassword(passwordEncoder.encode(demoPassword));
		user.setRole(Role.USER);
		return userRepository.save(user);
	}

	private void seedTransactions(User user) {
		LocalDate today = LocalDate.now();
		List<TransactionSeed> seeds = List.of(
				new TransactionSeed("Salary", new BigDecimal("6200"), TransactionType.INCOME,
						"Salary", "Monthly payroll", today.minusDays(2)),
				new TransactionSeed("Groceries", new BigDecimal("185.40"), TransactionType.EXPENSE,
						"Food", "Market run", today.minusDays(1)),
				new TransactionSeed("Ride share", new BigDecimal("24.90"), TransactionType.EXPENSE,
						"Transport", "Late meeting", today.minusDays(3)),
				new TransactionSeed("Streaming", new BigDecimal("19.99"), TransactionType.EXPENSE,
						"Entertainment", "Monthly plan", today.minusDays(4)),
				new TransactionSeed("Cafe", new BigDecimal("12.75"), TransactionType.EXPENSE,
						"Food", "Team catch-up", today.minusDays(5)),
				new TransactionSeed("Health insurance", new BigDecimal("220.00"),
						TransactionType.EXPENSE, "Bills", "Premium", today.minusDays(6)),
				new TransactionSeed("Investments", new BigDecimal("450.00"), TransactionType.EXPENSE,
						"Investments", "Index fund", today.minusDays(7)),
				new TransactionSeed("Side project", new BigDecimal("480.00"), TransactionType.INCOME,
						"Salary", "Freelance payout", today.minusDays(8))
		);

		List<Transaction> transactions = seeds.stream()
				.map(seed -> toTransaction(user, seed))
				.toList();
		transactionRepository.saveAll(transactions);
	}

	private void seedBudgets(User user, LocalDate month) {
		List<BudgetSeed> seeds = List.of(
				new BudgetSeed("Food", new BigDecimal("650")),
				new BudgetSeed("Transport", new BigDecimal("180")),
				new BudgetSeed("Entertainment", new BigDecimal("240")),
				new BudgetSeed("Shopping", new BigDecimal("400"))
		);

		List<Budget> budgets = seeds.stream()
				.map(seed -> toBudget(user, seed, month))
				.toList();
		budgetRepository.saveAll(budgets);
	}

	private Transaction toTransaction(User user, TransactionSeed seed) {
		Transaction transaction = new Transaction();
		transaction.setUser(user);
		transaction.setTitle(seed.title());
		transaction.setAmount(seed.amount());
		transaction.setType(seed.type());
		transaction.setCategory(seed.category());
		transaction.setNote(seed.note());
		transaction.setDate(seed.date());
		transaction.setRecurring(false);
		return transaction;
	}

	private Budget toBudget(User user, BudgetSeed seed, LocalDate month) {
		Budget budget = new Budget();
		budget.setUser(user);
		budget.setCategory(seed.category());
		budget.setAmount(seed.amount());
		budget.setMonth(month);
		return budget;
	}

	private record TransactionSeed(String title, BigDecimal amount, TransactionType type,
			String category, String note, LocalDate date) {
	}

	private record BudgetSeed(String category, BigDecimal amount) {
	}
}
