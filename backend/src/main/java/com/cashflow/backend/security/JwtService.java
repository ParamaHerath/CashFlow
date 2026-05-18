package com.cashflow.backend.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

import com.cashflow.backend.user.User;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
	private final JwtProperties properties;

	public JwtService(JwtProperties properties) {
		this.properties = properties;
	}

	public JwtToken generateAccessToken(User user) {
		Instant now = Instant.now();
		Instant expiresAt = now.plus(properties.accessTokenDuration());

		String token = Jwts.builder()
				.subject(user.getEmail())
				.issuer(properties.getIssuer())
				.claim("uid", user.getId().toString())
				.claim("role", user.getRole().name())
				.issuedAt(Date.from(now))
				.expiration(Date.from(expiresAt))
				.signWith(Keys.hmacShaKeyFor(properties.getSecret()
						.getBytes(StandardCharsets.UTF_8)))
				.compact();

		return new JwtToken(token, expiresAt);
	}

	public String extractSubject(String token) {
		return Jwts.parser()
				.verifyWith(Keys.hmacShaKeyFor(properties.getSecret()
						.getBytes(StandardCharsets.UTF_8)))
				.build()
				.parseSignedClaims(token)
				.getPayload()
				.getSubject();
	}

	public boolean isTokenValid(String token) {
		try {
			extractSubject(token);
			return true;
		} catch (JwtException | IllegalArgumentException ex) {
			return false;
		}
	}
}
