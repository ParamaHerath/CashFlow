package com.cashflow.backend.security;

import java.time.Duration;
import java.util.Arrays;
import java.util.Optional;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
public class AuthCookieService {
	private final JwtProperties properties;

	public AuthCookieService(JwtProperties properties) {
		this.properties = properties;
	}

	public ResponseCookie accessTokenCookie(String token) {
		return buildCookie(properties.getAccessCookieName(), token, properties.accessTokenDuration());
	}

	public ResponseCookie refreshTokenCookie(String token) {
		return buildCookie(properties.getRefreshCookieName(), token, properties.refreshTokenDuration());
	}

	public ResponseCookie clearAccessTokenCookie() {
		return clearCookie(properties.getAccessCookieName());
	}

	public ResponseCookie clearRefreshTokenCookie() {
		return clearCookie(properties.getRefreshCookieName());
	}

	public Optional<String> readAccessToken(HttpServletRequest request) {
		return readCookie(request, properties.getAccessCookieName());
	}

	public Optional<String> readRefreshToken(HttpServletRequest request) {
		return readCookie(request, properties.getRefreshCookieName());
	}

	public Optional<String> readCookie(HttpServletRequest request, String name) {
		Cookie[] cookies = request.getCookies();
		if (cookies == null) {
			return Optional.empty();
		}
		return Arrays.stream(cookies)
				.filter(cookie -> name.equals(cookie.getName()))
				.map(Cookie::getValue)
				.findFirst();
	}

	private ResponseCookie buildCookie(String name, String value, Duration maxAge) {
		return ResponseCookie.from(name, value)
				.httpOnly(true)
				.secure(properties.isCookieSecure())
				.sameSite(properties.getCookieSameSite())
				.path("/")
				.maxAge(maxAge)
				.build();
	}

	private ResponseCookie clearCookie(String name) {
		return ResponseCookie.from(name, "")
				.httpOnly(true)
				.secure(properties.isCookieSecure())
				.sameSite(properties.getCookieSameSite())
				.path("/")
				.maxAge(Duration.ZERO)
				.build();
	}
}
