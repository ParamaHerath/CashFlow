package com.cashflow.backend.auth;

import com.cashflow.backend.auth.dto.LoginRequest;
import com.cashflow.backend.auth.dto.RegisterRequest;
import com.cashflow.backend.auth.dto.UserProfile;
import com.cashflow.backend.common.exception.ConflictException;
import com.cashflow.backend.common.exception.UnauthorizedException;
import com.cashflow.backend.security.JwtService;
import com.cashflow.backend.security.JwtToken;
import com.cashflow.backend.user.Role;
import com.cashflow.backend.user.User;
import com.cashflow.backend.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final RefreshTokenService refreshTokenService;
	private final JwtService jwtService;

	public AuthService(UserRepository userRepository,
			PasswordEncoder passwordEncoder,
			AuthenticationManager authenticationManager,
			RefreshTokenService refreshTokenService,
			JwtService jwtService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.authenticationManager = authenticationManager;
		this.refreshTokenService = refreshTokenService;
		this.jwtService = jwtService;
	}

	public AuthTokens register(RegisterRequest request) {
		String email = normalizeEmail(request.email());
		if (userRepository.existsByEmail(email)) {
			throw new ConflictException("Email already in use");
		}

		User user = new User();
		user.setFullName(request.fullName());
		user.setEmail(email);
		user.setPassword(passwordEncoder.encode(request.password()));
		user.setRole(Role.USER);

		User saved = userRepository.save(user);
		return issueTokens(saved);
	}

	public AuthTokens login(LoginRequest request) {
		String email = normalizeEmail(request.email());
		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(email, request.password()));
		} catch (Exception ex) {
			throw new UnauthorizedException("Invalid email or password");
		}

		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
		return issueTokens(user);
	}

	public AuthTokens refresh(String refreshToken) {
		RefreshToken rotated = refreshTokenService.rotateToken(refreshToken);
		return issueTokens(rotated.getUser(), rotated);
	}

	public void logout(String refreshToken) {
		refreshTokenService.revokeToken(refreshToken);
	}

	private AuthTokens issueTokens(User user) {
		RefreshToken refreshToken = refreshTokenService.createToken(user);
		return issueTokens(user, refreshToken);
	}

	private AuthTokens issueTokens(User user, RefreshToken refreshToken) {
		JwtToken accessToken = jwtService.generateAccessToken(user);
		return new AuthTokens(
				UserProfile.from(user),
				accessToken.token(),
				accessToken.expiresAt(),
				refreshToken.getToken()
		);
	}

	private String normalizeEmail(String email) {
		return email == null ? null : email.trim().toLowerCase();
	}
}
