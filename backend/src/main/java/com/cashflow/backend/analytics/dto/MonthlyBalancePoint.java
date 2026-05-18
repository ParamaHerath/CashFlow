package com.cashflow.backend.analytics.dto;

import java.math.BigDecimal;

public record MonthlyBalancePoint(
		String month,
		BigDecimal income,
		BigDecimal expense,
		BigDecimal net
) {}
