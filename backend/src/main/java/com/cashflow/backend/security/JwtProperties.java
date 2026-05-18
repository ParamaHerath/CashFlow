package com.cashflow.backend.security;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {
	private String issuer;
	private String secret;
	private long accessTokenExpMin;
	private long refreshTokenExpDays;
	private String accessCookieName;
	private String refreshCookieName;
	private boolean cookieSecure;
	private String cookieSameSite;

	public String getIssuer() {
		return issuer;
	}

	public void setIssuer(String issuer) {
		this.issuer = issuer;
	}

	public String getSecret() {
		return secret;
	}

	public void setSecret(String secret) {
		this.secret = secret;
	}

	public long getAccessTokenExpMin() {
		return accessTokenExpMin;
	}

	public void setAccessTokenExpMin(long accessTokenExpMin) {
		this.accessTokenExpMin = accessTokenExpMin;
	}

	public long getRefreshTokenExpDays() {
		return refreshTokenExpDays;
	}

	public void setRefreshTokenExpDays(long refreshTokenExpDays) {
		this.refreshTokenExpDays = refreshTokenExpDays;
	}

	public String getAccessCookieName() {
		return accessCookieName;
	}

	public void setAccessCookieName(String accessCookieName) {
		this.accessCookieName = accessCookieName;
	}

	public String getRefreshCookieName() {
		return refreshCookieName;
	}

	public void setRefreshCookieName(String refreshCookieName) {
		this.refreshCookieName = refreshCookieName;
	}

	public boolean isCookieSecure() {
		return cookieSecure;
	}

	public void setCookieSecure(boolean cookieSecure) {
		this.cookieSecure = cookieSecure;
	}

	public String getCookieSameSite() {
		return cookieSameSite;
	}

	public void setCookieSameSite(String cookieSameSite) {
		this.cookieSameSite = cookieSameSite;
	}

	public Duration accessTokenDuration() {
		return Duration.ofMinutes(accessTokenExpMin);
	}

	public Duration refreshTokenDuration() {
		return Duration.ofDays(refreshTokenExpDays);
	}
}
