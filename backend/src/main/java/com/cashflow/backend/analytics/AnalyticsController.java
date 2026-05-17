package com.cashflow.backend.analytics;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.cashflow.backend.analytics.dto.AnalyticsSummaryResponse;
import com.cashflow.backend.analytics.dto.CategoryBreakdown;
import com.cashflow.backend.analytics.dto.MonthlyBalancePoint;
import com.cashflow.backend.analytics.dto.WeeklySpendingPoint;
import com.cashflow.backend.common.exception.UnauthorizedException;
import com.cashflow.backend.security.UserPrincipal;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
	private final AnalyticsService analyticsService;

	public AnalyticsController(AnalyticsService analyticsService) {
		this.analyticsService = analyticsService;
	}

	@GetMapping("/summary")
	public AnalyticsSummaryResponse summary(@AuthenticationPrincipal UserPrincipal principal,
			@RequestParam(required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate month) {
		UUID userId = requireUser(principal);
		return analyticsService.getSummary(userId, month);
	}

	@GetMapping("/monthly-balance")
	public List<MonthlyBalancePoint> monthlyBalance(@AuthenticationPrincipal UserPrincipal principal,
			@RequestParam(defaultValue = "6") int months) {
		UUID userId = requireUser(principal);
		return analyticsService.getMonthlyBalance(userId, months);
	}

	@GetMapping("/weekly-spending")
	public List<WeeklySpendingPoint> weeklySpending(@AuthenticationPrincipal UserPrincipal principal,
			@RequestParam(defaultValue = "7") int days) {
		UUID userId = requireUser(principal);
		return analyticsService.getWeeklySpending(userId, days);
	}

	@GetMapping("/category-breakdown")
	public List<CategoryBreakdown> categoryBreakdown(@AuthenticationPrincipal UserPrincipal principal,
			@RequestParam(required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate month) {
		UUID userId = requireUser(principal);
		return analyticsService.getCategoryBreakdown(userId, month);
	}

	private UUID requireUser(UserPrincipal principal) {
		if (principal == null) {
			throw new UnauthorizedException("Not authenticated");
		}
		return principal.getId();
	}
}
