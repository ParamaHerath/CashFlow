package com.cashflow.backend.category.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryUpdateRequest(
		@NotBlank String name,
		@NotBlank String color,
		@NotBlank String icon
) {}
