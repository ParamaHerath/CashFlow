package com.cashflow.backend.auth.dto;

import java.time.Instant;

public record AuthResponse(UserProfile user, Instant accessTokenExpiresAt) {}
