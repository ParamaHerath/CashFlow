package com.cashflow.backend.auth;

import java.time.Instant;

import com.cashflow.backend.auth.dto.UserProfile;

public record AuthTokens(
		UserProfile user,
		String accessToken,
		Instant accessTokenExpiresAt,
		String refreshToken
) {}
