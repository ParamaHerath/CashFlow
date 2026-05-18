package com.cashflow.backend.transaction;

import java.math.BigDecimal;

public interface CategoryTotal {
	String getCategory();

	BigDecimal getTotal();
}
