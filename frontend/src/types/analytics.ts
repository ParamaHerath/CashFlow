export type AnalyticsSummary = {
	totalBalance: number;
	totalIncome: number;
	totalExpenses: number;
	savings: number;
	budgetUsagePercent: number;
};

export type MonthlyBalancePoint = {
	month: string;
	income: number;
	expense: number;
	net: number;
};

export type WeeklySpendingPoint = {
	date: string;
	expense: number;
};

export type CategoryBreakdown = {
	category: string;
	total: number;
	percentage: number;
};
