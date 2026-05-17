import { api } from "@/lib/api";
import type {
	AnalyticsSummary,
	CategoryBreakdown,
	MonthlyBalancePoint,
	WeeklySpendingPoint,
} from "@/types/analytics";

type SummaryQuery = {
	month?: string;
};

type BalanceQuery = {
	months?: number;
};

type WeeklyQuery = {
	days?: number;
};

type CategoryQuery = {
	month?: string;
};

export async function fetchSummary(query?: SummaryQuery) {
	const { data } = await api.get<AnalyticsSummary>("/api/analytics/summary", {
		params: query,
	});
	return data;
}

export async function fetchMonthlyBalance(query?: BalanceQuery) {
	const { data } = await api.get<MonthlyBalancePoint[]>(
		"/api/analytics/monthly-balance",
		{ params: query }
	);
	return data;
}

export async function fetchWeeklySpending(query?: WeeklyQuery) {
	const { data } = await api.get<WeeklySpendingPoint[]>(
		"/api/analytics/weekly-spending",
		{ params: query }
	);
	return data;
}

export async function fetchCategoryBreakdown(query?: CategoryQuery) {
	const { data } = await api.get<CategoryBreakdown[]>(
		"/api/analytics/category-breakdown",
		{ params: query }
	);
	return data;
}
