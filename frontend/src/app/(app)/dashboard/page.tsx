"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
	Bar,
	BarChart,
	Cell,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	fetchCategoryBreakdown,
	fetchMonthlyBalance,
	fetchSummary,
	fetchWeeklySpending,
} from "@/lib/analytics";
import { fetchTransactions } from "@/lib/transactions";
import { useAuthStore } from "@/stores/authStore";
import type {
	AnalyticsSummary,
	CategoryBreakdown,
	MonthlyBalancePoint,
	WeeklySpendingPoint,
} from "@/types/analytics";
import type { Transaction } from "@/types/transactions";

const COLORS = [
	"#2563EB",
	"#F97316",
	"#10B981",
	"#EC4899",
	"#6366F1",
	"#F59E0B",
];

export default function DashboardPage() {
	const user = useAuthStore((state) => state.user);
	const firstName = user?.fullName?.split(" ")[0];
	const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
	const [monthlyBalance, setMonthlyBalance] = useState<MonthlyBalancePoint[]>([]);
	const [weeklySpending, setWeeklySpending] = useState<WeeklySpendingPoint[]>([]);
	const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
	const [recent, setRecent] = useState<Transaction[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const loadDashboard = useCallback(async () => {
		setIsLoading(true);
		try {
			const [summaryData, monthlyData, weeklyData, categoryData, transactions] =
				await Promise.all([
					fetchSummary(),
					fetchMonthlyBalance({ months: 6 }),
					fetchWeeklySpending({ days: 7 }),
					fetchCategoryBreakdown(),
					fetchTransactions({ page: 0, size: 5 }),
				]);
			setSummary(summaryData);
			setMonthlyBalance(monthlyData);
			setWeeklySpending(weeklyData);
			setCategoryBreakdown(categoryData);
			setRecent(transactions.items);
		} catch {
			toast.error("Unable to load dashboard");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		loadDashboard();
	}, [loadDashboard]);

	const summaryCards = useMemo(() => {
		if (!summary) {
			return [];
		}
		return [
			{ label: "Total balance", value: summary.totalBalance, accent: "text-primary", bg: "bg-gradient-to-br from-blue-500/20 to-blue-500/10 border-none" },
			{ label: "Total income", value: summary.totalIncome, accent: "text-emerald-500", bg: "bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 border-none" },
			{ label: "Total expenses", value: summary.totalExpenses, accent: "text-rose-500", bg: "bg-gradient-to-br from-rose-500/20 to-rose-500/10 border-none" },
			{ label: "Budget usage", value: summary.budgetUsagePercent, suffix: "%", bg: "bg-gradient-to-br from-purple-500/20 to-purple-500/10 border-none" },
			{ label: "Savings", value: summary.savings, accent: "text-amber-500", bg: "bg-gradient-to-br from-amber-500/20 to-amber-500/10 border-none" },
		];
	}, [summary]);

	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Good morning";
		if (hour < 17) return "Good afternoon";
		return "Good evening";
	};

	return (
		<div className="space-y-6">
			<div>
				<h2 className="font-display text-3xl font-bold tracking-tight">
					{getGreeting()}{firstName ? `, ${firstName}` : ""}!
				</h2>
				<p className="text-sm text-muted-foreground mt-1">
					Here's what's happening with your cash flow today.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
				{isLoading
					? Array.from({ length: 5 }).map((_, index) => (
						<Card key={index} className="space-y-3">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-8 w-32" />
						</Card>
					))
					: summaryCards.map((card) => (
						<Card key={card.label} className={`space-y-2 ${card.bg}`}>
							<p className="text-sm text-muted-foreground">{card.label}</p>
							<p className={`font-display text-2xl font-semibold ${card.accent ?? ""}`}>
								{card.suffix
									? `${card.value.toFixed(2)}${card.suffix}`
									: `$${card.value.toFixed(2)}`}
							</p>
						</Card>
					))}
			</div>

			<div className="grid gap-4 xl:grid-cols-2">
				<Card className="space-y-4">
					<p className="font-semibold">Monthly running balance</p>
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={monthlyBalance}>
								<XAxis dataKey="month" stroke="#94A3B8" />
								<YAxis stroke="#94A3B8" />
								<Tooltip />
								<Line type="monotone" dataKey="net" stroke="#2563EB" />
								<Line type="monotone" dataKey="income" stroke="#10B981" />
								<Line type="monotone" dataKey="expense" stroke="#F97316" />
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

			<div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
				<Card className="space-y-4">
					<p className="font-semibold">Category split</p>
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
				<Card className="space-y-4">
					<p className="font-semibold">Recent transactions</p>
					<div className="space-y-3">
						{isLoading
							? Array.from({ length: 5 }).map((_, index) => (
								<Card key={index} className="space-y-2">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-3 w-24" />
								</Card>
							))
							: recent.map((transaction) => {
									const isIncome = transaction.type === "INCOME";
									const bgClass = isIncome
										? "bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 border-none"
										: "bg-gradient-to-br from-rose-500/20 to-rose-500/10 border-none";
									return (
										<div
											key={transaction.id}
											className={`flex items-center justify-between rounded-2xl px-4 py-3 ${bgClass}`}
										>
											<div>
												<p className="font-medium">{transaction.title}</p>
												<p className="text-xs text-muted-foreground">
													{transaction.category} • {transaction.date}
												</p>
											</div>
											<div className="flex items-center gap-2 text-sm font-semibold">
												{isIncome ? (
													<ArrowUpRight className="h-4 w-4 text-emerald-500" />
												) : (
													<ArrowDownRight className="h-4 w-4 text-rose-500" />
												)}
												<span className={isIncome ? "text-emerald-500" : "text-rose-500"}>
													{isIncome ? "+" : "-"}${transaction.amount.toFixed(2)}
												</span>
											</div>
										</div>
									);
								})}
					</div>
				</Card>
			</div>
		</div>
	);
}
