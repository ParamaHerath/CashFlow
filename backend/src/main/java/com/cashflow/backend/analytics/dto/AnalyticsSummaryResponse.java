package com.cashflow.backend.analytics.dto;

import java.math.BigDecimal;

public record AnalyticsSummaryResponse(
		BigDecimal totalBalance,
		BigDecimal totalIncome,
		BigDecimal totalExpenses,
		BigDecimal savings,
		BigDecimal budgetUsagePercent
) {}
