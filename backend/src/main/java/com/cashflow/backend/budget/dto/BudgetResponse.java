package com.cashflow.backend.budget.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import com.cashflow.backend.budget.Budget;

public record BudgetResponse(
		UUID id,
		String category,
		BigDecimal amount,
		LocalDate month,
		BigDecimal spent,
		BigDecimal remaining,
		BigDecimal usagePercent
) {
	public static BudgetResponse from(Budget budget,
			BigDecimal spent,
			BigDecimal remaining,
			BigDecimal usagePercent) {
		return new BudgetResponse(
				budget.getId(),
				budget.getCategory(),
				budget.getAmount(),
				budget.getMonth(),
				spent,
				remaining,
				usagePercent
		);
	}
}
