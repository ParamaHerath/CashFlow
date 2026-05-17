package com.cashflow.backend.analytics.dto;

import java.math.BigDecimal;

public record WeeklySpendingPoint(
		String date,
		BigDecimal expense
) {}
