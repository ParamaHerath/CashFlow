package com.cashflow.backend.transaction.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import com.cashflow.backend.transaction.Transaction;
import com.cashflow.backend.transaction.TransactionType;

public record TransactionResponse(
		UUID id,
		String title,
		BigDecimal amount,
		TransactionType type,
		String category,
		String note,
		LocalDate date,
		boolean recurring,
		Instant createdAt
) {
	public static TransactionResponse from(Transaction transaction) {
		return new TransactionResponse(
				transaction.getId(),
				transaction.getTitle(),
				transaction.getAmount(),
				transaction.getType(),
				transaction.getCategory(),
				transaction.getNote(),
				transaction.getDate(),
				transaction.isRecurring(),
				transaction.getCreatedAt()
		);
	}
}
