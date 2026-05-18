package com.cashflow.backend.category.dto;

import java.math.BigDecimal;
import java.util.UUID;

import com.cashflow.backend.category.Category;

public record CategoryResponse(
		UUID id,
		String name,
		String color,
		String icon,
		BigDecimal monthlyTotal,
		BigDecimal expenseShare
) {
	public static CategoryResponse from(Category category, BigDecimal monthlyTotal,
			BigDecimal expenseShare) {
		return new CategoryResponse(
				category.getId(),
				category.getName(),
				category.getColor(),
				category.getIcon(),
				monthlyTotal,
				expenseShare
		);
	}
}
