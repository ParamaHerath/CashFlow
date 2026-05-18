package com.cashflow.backend.auth;

import com.cashflow.backend.auth.dto.AuthResponse;
import com.cashflow.backend.auth.dto.LoginRequest;
import com.cashflow.backend.auth.dto.RegisterRequest;
import com.cashflow.backend.auth.dto.UserProfile;
import com.cashflow.backend.common.ApiResponse;
import com.cashflow.backend.common.exception.UnauthorizedException;
import com.cashflow.backend.security.AuthCookieService;
import com.cashflow.backend.security.UserPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private final AuthService authService;
	private final AuthCookieService authCookieService;

	public AuthController(AuthService authService, AuthCookieService authCookieService) {
		this.authService = authService;
		this.authCookieService = authCookieService;
	}

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
		AuthTokens tokens = authService.register(request);
		return buildAuthResponse(tokens);
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
		AuthTokens tokens = authService.login(request);
		return buildAuthResponse(tokens);
	}

	@PostMapping("/refresh")
	public ResponseEntity<AuthResponse> refresh(HttpServletRequest request) {
		String refreshToken = authCookieService.readRefreshToken(request)
				.orElseThrow(() -> new UnauthorizedException("Refresh token missing"));
		AuthTokens tokens = authService.refresh(refreshToken);
		return buildAuthResponse(tokens);
	}

	@PostMapping("/logout")
	public ResponseEntity<ApiResponse> logout(HttpServletRequest request) {
		authCookieService.readRefreshToken(request)
				.ifPresent(authService::logout);

		return ResponseEntity.ok()
				.header(HttpHeaders.SET_COOKIE, authCookieService.clearAccessTokenCookie().toString())
				.header(HttpHeaders.SET_COOKIE, authCookieService.clearRefreshTokenCookie().toString())
				.body(new ApiResponse("Logged out"));
	}

	@GetMapping("/me")
	public UserProfile me(@AuthenticationPrincipal UserPrincipal principal) {
		if (principal == null) {
			throw new UnauthorizedException("Not authenticated");
		}
		String role = principal.getAuthorities().stream()
				.findFirst()
				.map(auth -> auth.getAuthority().replace("ROLE_", ""))
				.orElse("USER");
		return new UserProfile(principal.getId(), principal.getFullName(),
				principal.getUsername(), role);
	}

	private ResponseEntity<AuthResponse> buildAuthResponse(AuthTokens tokens) {
		AuthResponse body = new AuthResponse(tokens.user(), tokens.accessTokenExpiresAt());
		return ResponseEntity.ok()
				.header(HttpHeaders.SET_COOKIE, authCookieService.accessTokenCookie(tokens.accessToken())
						.toString())
				.header(HttpHeaders.SET_COOKIE, authCookieService.refreshTokenCookie(tokens.refreshToken())
						.toString())
				.body(body);
	}
}
