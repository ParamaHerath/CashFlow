"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
	Bar,
	BarChart,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	fetchCategoryBreakdown,
	fetchMonthlyBalance,
	fetchSummary,
	fetchWeeklySpending,
} from "@/lib/analytics";
import type {
	AnalyticsSummary,
	CategoryBreakdown,
	MonthlyBalancePoint,
	WeeklySpendingPoint,
} from "@/types/analytics";

const COLORS = [
	"#2563EB",
	"#F97316",
	"#10B981",
	"#EC4899",
	"#6366F1",
	"#F59E0B",
];

export default function AnalyticsPage() {
	const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
	const [monthlyBalance, setMonthlyBalance] = useState<MonthlyBalancePoint[]>([]);
	const [weeklySpending, setWeeklySpending] = useState<WeeklySpendingPoint[]>([]);
	const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const loadAnalytics = useCallback(async () => {
		setIsLoading(true);
		try {
			const [summaryData, balanceData, weeklyData, categoryData] =
				await Promise.all([
					fetchSummary(),
					fetchMonthlyBalance({ months: 6 }),
					fetchWeeklySpending({ days: 7 }),
					fetchCategoryBreakdown(),
				]);
			setSummary(summaryData);
			setMonthlyBalance(balanceData);
			setWeeklySpending(weeklyData);
			setCategoryBreakdown(categoryData);
		} catch {
			toast.error("Unable to load analytics");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		loadAnalytics();
	}, [loadAnalytics]);

	const summaryCards = useMemo(() => {
		if (!summary) {
			return [];
		}
		return [
			{ label: "Net balance", value: summary.totalBalance },
			{ label: "Total income", value: summary.totalIncome },
			{ label: "Total expenses", value: summary.totalExpenses },
			{ label: "Budget usage", value: summary.budgetUsagePercent, suffix: "%" },
		];
	}, [summary]);

	return (
		<div className="space-y-6">
			<div>
				<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
					Analytics
				</p>
				<h2 className="font-display text-2xl font-semibold">
					A deeper look at your cash flow
				</h2>
			</div>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{isLoading
					? Array.from({ length: 4 }).map((_, index) => (
						<Card key={index} className="space-y-3">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-8 w-32" />
						</Card>
					))
					: summaryCards.map((card) => (
						<Card key={card.label} className="space-y-2">
							<p className="text-sm text-muted-foreground">{card.label}</p>
							<p className="font-display text-2xl font-semibold">
								{card.suffix
									? `${card.value.toFixed(2)}${card.suffix}`
									: `$${card.value.toFixed(2)}`}
							</p>
						</Card>
					))}
			</div>

			<div className="grid gap-4 xl:grid-cols-2">
				<Card className="space-y-4">
					<p className="font-semibold">Monthly balance</p>
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={monthlyBalance}>
								<XAxis dataKey="month" stroke="#94A3B8" />
								<YAxis stroke="#94A3B8" />
								<Tooltip />
								<Legend />
								<Line type="monotone" dataKey="income" stroke="#10B981" />
								<Line type="monotone" dataKey="expense" stroke="#F97316" />
								<Line type="monotone" dataKey="net" stroke="#2563EB" />
							</LineChart>
						</ResponsiveContainer>
					</div>
				</Card>
				<Card className="space-y-4">
					<p className="font-semibold">Weekly spending</p>
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={weeklySpending}>
								<XAxis dataKey="date" stroke="#94A3B8" />
								<YAxis stroke="#94A3B8" />
								<Tooltip />
								<Bar dataKey="expense" fill="#F97316" radius={[8, 8, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</Card>
			</div>

			<Card className="space-y-4">
				<p className="font-semibold">Category breakdown</p>
				<div className="h-64">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={categoryBreakdown}
								dataKey="total"
								nameKey="category"
								outerRadius={90}
								label
							>
								{categoryBreakdown.map((entry, index) => (
									<Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</div>
			</Card>
		</div>
	);
}
