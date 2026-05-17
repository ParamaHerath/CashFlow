package com.cashflow.backend.analytics.dto;

import java.math.BigDecimal;

public record CategoryBreakdown(
		String category,
		BigDecimal total,
		BigDecimal percentage
) {}
