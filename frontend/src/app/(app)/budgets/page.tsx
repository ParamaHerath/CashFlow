"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Pencil, Plus, Trash2 } from "lucide-react";

import { BudgetForm } from "@/components/budgets/BudgetForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchBudgets, createBudget, deleteBudget, updateBudget } from "@/lib/budgets";
import { fetchCategories } from "@/lib/categories";
import type { Budget, BudgetPayload } from "@/types/budgets";
import type { Category } from "@/types/categories";

const currentMonth = new Date().toISOString().slice(0, 7);

export default function BudgetsPage() {
	const [month, setMonth] = useState(currentMonth);
	const [budgets, setBudgets] = useState<Budget[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editing, setEditing] = useState<Budget | null>(null);

	const loadBudgets = useCallback(async () => {
		setIsLoading(true);
		try {
			const [budgetsData, categoriesData] = await Promise.all([
				fetchBudgets({ month: `${month}-01` }),
				fetchCategories(),
			]);
			setBudgets(budgetsData);
			setCategories(categoriesData);
		} catch {
			toast.error("Unable to load budgets");
		} finally {
			setIsLoading(false);
		}
	}, [month]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		loadBudgets();
	}, [loadBudgets]);

	const summary = useMemo(() => {
		const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
		const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
		const warnings = budgets.filter((budget) => budget.usagePercent >= 90).length;
		return { totalBudget, totalSpent, warnings };
	}, [budgets]);

	const openCreate = () => {
		setEditing(null);
		setIsDialogOpen(true);
	};

	const openEdit = (budget: Budget) => {
		setEditing(budget);
		setIsDialogOpen(true);
	};

	const handleCreate = async (payload: BudgetPayload) => {
		await createBudget(payload);
		toast.success("Budget created");
		setIsDialogOpen(false);
		loadBudgets();
	};

	const handleUpdate = async (payload: BudgetPayload) => {
		if (!editing) {
			return;
		}
		await updateBudget(editing.id, payload);
		toast.success("Budget updated");
		setIsDialogOpen(false);
		setEditing(null);
		loadBudgets();
	};

	const handleDelete = async (budget: Budget) => {
		const confirmed = window.confirm(`Delete budget for ${budget.category}?`);
		if (!confirmed) {
			return;
		}
		try {
			await deleteBudget(budget.id);
			toast.success("Budget deleted");
			loadBudgets();
		} catch {
			toast.error("Unable to delete budget");
		}
	};

	const getUsageColor = (value: number) => {
		if (value >= 90) {
			return "bg-rose-500";
		}
		if (value >= 70) {
			return "bg-amber-500";
		}
		return "bg-emerald-500";
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-end gap-4">
				<Button onClick={openCreate}>
					<Plus size={18} />
					New budget
				</Button>
			</div>

			<Card className="grid gap-4 md:grid-cols-3">
				<div>
					<p className="text-sm text-muted-foreground">Month</p>
					<Input type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
				</div>
				<div>
					<p className="text-sm text-muted-foreground">Total budgeted</p>
					<p className="font-display text-2xl font-semibold">
						${summary.totalBudget.toFixed(2)}
					</p>
					<p className="text-xs text-muted-foreground">
						${summary.totalSpent.toFixed(2)} spent so far
					</p>
				</div>
				<div className="flex items-center gap-3">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/15 text-rose-500">
						<AlertTriangle size={18} />
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Near limit</p>
						<p className="font-display text-xl font-semibold">
							{summary.warnings}
						</p>
					</div>
				</div>
			</Card>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{isLoading ? (
					Array.from({ length: 6 }).map((_, index) => (
						<Card key={index} className="space-y-3">
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-4 w-40" />
							<Skeleton className="h-2 w-full" />
						</Card>
					))
				) : budgets.length ? (
					budgets.map((budget) => (
						<Card key={budget.id} className="space-y-4">
							<div className="flex items-start justify-between">
								<div>
									<p className="font-semibold">{budget.category}</p>
									<p className="text-sm text-muted-foreground">
										${budget.spent.toFixed(2)} spent of ${budget.amount.toFixed(2)}
									</p>
								</div>
								<div className="flex items-center gap-2">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => openEdit(budget)}
										aria-label="Edit budget"
									>
										<Pencil size={16} />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleDelete(budget)}
										aria-label="Delete budget"
									>
										<Trash2 size={16} />
									</Button>
								</div>
							</div>
							<div className="text-xs text-muted-foreground">
								{budget.remaining.toFixed(2)} remaining
							</div>
							<div>
								<div className="flex items-center justify-between text-xs text-muted-foreground">
									<span>Usage</span>
									<span>{budget.usagePercent.toFixed(2)}%</span>
								</div>
								<div className="mt-2 h-2 rounded-full bg-muted/70">
									<div
										className={`h-full rounded-full ${getUsageColor(budget.usagePercent)}`}
										style={{ width: `${Math.min(budget.usagePercent, 100)}%` }}
									/>
								</div>
							</div>
						</Card>
					))
				) : (
					<Card className="col-span-full flex flex-col items-center gap-3 py-12 text-center">
						<p className="font-display text-lg font-semibold">No budgets yet</p>
						<p className="max-w-sm text-sm text-muted-foreground">
							Create a monthly plan to keep spending on track.
						</p>
						<Button onClick={openCreate}>Create budget</Button>
					</Card>
				)}
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{editing ? "Edit budget" : "Create budget"}
						</DialogTitle>
						<DialogDescription>
							Set a monthly cap and track progress in real time.
						</DialogDescription>
					</DialogHeader>
					<BudgetForm
						initial={editing}
						categories={categories}
						onCancel={() => setIsDialogOpen(false)}
						onSubmit={editing ? handleUpdate : handleCreate}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
