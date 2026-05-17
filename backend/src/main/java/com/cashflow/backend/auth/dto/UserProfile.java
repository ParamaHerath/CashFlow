package com.cashflow.backend.auth.dto;

import java.util.UUID;

import com.cashflow.backend.user.User;

public record UserProfile(UUID id, String fullName, String email, String role) {
	public static UserProfile from(User user) {
		return new UserProfile(user.getId(), user.getFullName(), user.getEmail(),
				user.getRole().name());
	}
}
