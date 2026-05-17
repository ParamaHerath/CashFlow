package com.cashflow.backend.transaction;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TransactionRepository extends JpaRepository<Transaction, UUID>,
		JpaSpecificationExecutor<Transaction> {
	Optional<Transaction> findByIdAndUser_Id(UUID id, UUID userId);
}
