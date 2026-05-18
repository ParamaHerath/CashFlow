package com.cashflow.backend.category;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
	List<Category> findByUser_IdOrderByNameAsc(UUID userId);

	Optional<Category> findByIdAndUser_Id(UUID id, UUID userId);

	boolean existsByUser_IdAndNameIgnoreCase(UUID userId, String name);

	boolean existsByUser_Id(UUID userId);
}
