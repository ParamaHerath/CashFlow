package com.cashflow.backend.auth;

import java.time.Instant;
import java.util.UUID;

import com.cashflow.backend.common.exception.UnauthorizedException;
import com.cashflow.backend.security.JwtProperties;
import com.cashflow.backend.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RefreshTokenService {
	private final RefreshTokenRepository refreshTokenRepository;
	private final JwtProperties jwtProperties;

	public RefreshTokenService(RefreshTokenRepository refreshTokenRepository,
			JwtProperties jwtProperties) {
		this.refreshTokenRepository = refreshTokenRepository;
		this.jwtProperties = jwtProperties;
	}

	public RefreshToken createToken(User user) {
		RefreshToken refreshToken = new RefreshToken();
		refreshToken.setUser(user);
		refreshToken.setToken(UUID.randomUUID().toString());
		refreshToken.setExpiresAt(Instant.now().plus(jwtProperties.refreshTokenDuration()));
		return refreshTokenRepository.save(refreshToken);
	}

	@Transactional
	public RefreshToken rotateToken(String token) {
		RefreshToken existing = refreshTokenRepository.findByToken(token)
				.orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));
		if (existing.getExpiresAt().isBefore(Instant.now())) {
			refreshTokenRepository.delete(existing);
			throw new UnauthorizedException("Refresh token expired");
		}

		refreshTokenRepository.delete(existing);
		return createToken(existing.getUser());
	}

	@Transactional
	public void revokeToken(String token) {
		refreshTokenRepository.deleteByToken(token);
	}
}
