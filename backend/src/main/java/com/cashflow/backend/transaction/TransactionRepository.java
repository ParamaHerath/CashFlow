package com.cashflow.backend.transaction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TransactionRepository extends JpaRepository<Transaction, UUID>,
		JpaSpecificationExecutor<Transaction> {
	Optional<Transaction> findByIdAndUser_Id(UUID id, UUID userId);

	List<Transaction> findByUser_IdAndDateBetween(UUID userId, LocalDate from, LocalDate to);

	@Query("select t.category as category, coalesce(sum(t.amount), 0) as total "
			+ "from Transaction t "
			+ "where t.user.id = :userId and t.type = :type and t.date between :from and :to "
			+ "group by t.category")
	List<CategoryTotal> sumByCategory(@Param("userId") UUID userId,
			@Param("type") TransactionType type,
			@Param("from") LocalDate from,
			@Param("to") LocalDate to);

	@Query("select coalesce(sum(t.amount), 0) from Transaction t "
			+ "where t.user.id = :userId and t.type = :type and t.date between :from and :to")
	BigDecimal sumByUserAndTypeAndDateBetween(@Param("userId") UUID userId,
			@Param("type") TransactionType type,
			@Param("from") LocalDate from,
			@Param("to") LocalDate to);
}
