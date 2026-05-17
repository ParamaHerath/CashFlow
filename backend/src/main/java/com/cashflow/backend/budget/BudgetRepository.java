package com.cashflow.backend.budget;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetRepository extends JpaRepository<Budget, UUID> {
	List<Budget> findByUser_IdAndMonth(UUID userId, LocalDate month);

	Optional<Budget> findByIdAndUser_Id(UUID id, UUID userId);

	boolean existsByUser_IdAndCategoryIgnoreCaseAndMonth(UUID userId, String category,
			LocalDate month);
}
