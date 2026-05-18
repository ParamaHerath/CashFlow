package com.cashflow.backend.transaction.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.cashflow.backend.transaction.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TransactionUpdateRequest(
		@NotBlank String title,
		@NotNull @DecimalMin("0.01") BigDecimal amount,
		@NotNull TransactionType type,
		@NotBlank String category,
		@Size(max = 500) String note,
		@NotNull LocalDate date,
		boolean recurring
) {}
