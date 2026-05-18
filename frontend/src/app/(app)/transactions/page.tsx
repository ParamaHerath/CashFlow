"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
	ArrowDownRight,
	ArrowUpRight,
	Calendar,
	Pencil,
	Plus,
	Search,
	Trash2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import {
	createTransaction,
	deleteTransaction,
	fetchTransactions,
	updateTransaction,
} from "@/lib/transactions";
import type { Transaction, TransactionPage, TransactionType } from "@/types/transactions";

const PAGE_SIZE = 8;

export default function TransactionsPage() {
	const [page, setPage] = useState(0);
	const [filters, setFilters] = useState({
		search: "",
		type: "ALL",
		category: "",
		from: "",
		to: "",
	});
	const [data, setData] = useState<TransactionPage | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editing, setEditing] = useState<Transaction | null>(null);

	const categories = useMemo(() => {
		if (!data) {
			return [] as string[];
		}
		return Array.from(new Set(data.items.map((item) => item.category))).sort();
	}, [data]);

	const loadTransactions = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await fetchTransactions({
				page,
				size: PAGE_SIZE,
				search: filters.search || undefined,
				type: filters.type === "ALL" ? undefined : filters.type,
				category: filters.category || undefined,
				from: filters.from || undefined,
				to: filters.to || undefined,
			});
			setData(response);
		} catch {
			toast.error("Unable to load transactions");
		} finally {
			setIsLoading(false);
		}
	}, [page, filters]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		loadTransactions();
	}, [loadTransactions]);

	const handleCreate = async (payload: {
		title: string;
		amount: number;
		type: TransactionType;
		category: string;
		note?: string | null;
		date: string;
		recurring: boolean;
	}) => {
		await createTransaction(payload);
		toast.success("Transaction added");
		setIsDialogOpen(false);
		setEditing(null);
		loadTransactions();
	};

	const handleUpdate = async (payload: {
		title: string;
		amount: number;
		type: TransactionType;
		category: string;
		note?: string | null;
		date: string;
		recurring: boolean;
	}) => {
		if (!editing) {
			return;
		}
		await updateTransaction(editing.id, payload);
		toast.success("Transaction updated");
		setIsDialogOpen(false);
		setEditing(null);
		loadTransactions();
	};

	const handleDelete = async (transaction: Transaction) => {
		const confirmed = window.confirm("Delete this transaction?");
		if (!confirmed) {
			return;
		}
		try {
			await deleteTransaction(transaction.id);
			toast.success("Transaction deleted");
			loadTransactions();
		} catch {
			toast.error("Unable to delete transaction");
		}
	};

	const openCreate = () => {
		setEditing(null);
		setIsDialogOpen(true);
	};

	const openEdit = (transaction: Transaction) => {
		setEditing(transaction);
		setIsDialogOpen(true);
	};

	const totalPages = data?.totalPages ?? 0;

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
						Transactions
					</p>
					<h2 className="font-display text-2xl font-semibold">
						Keep every move accounted
					</h2>
				</div>
				<Button onClick={openCreate}>
					<Plus size={18} />
					Add transaction
				</Button>
			</div>

			<Card className="space-y-4">
				<div className="flex flex-wrap items-center gap-3">
					<div className="relative flex-1 min-w-[220px]">
						<Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search by title or note"
							className="pl-10"
							value={filters.search}
							onChange={(event) =>
								setFilters((prev) => ({
									...prev,
									search: event.target.value,
								}))
							}
						/>
					</div>
					<select
						className="h-11 rounded-2xl border border-input bg-card/70 px-4 text-sm"
						value={filters.type}
						onChange={(event) =>
							setFilters((prev) => ({
								...prev,
								type: event.target.value,
							}))
						}
					>
						<option value="ALL">All types</option>
						<option value="INCOME">Income</option>
						<option value="EXPENSE">Expense</option>
					</select>
					<select
						className="h-11 rounded-2xl border border-input bg-card/70 px-4 text-sm"
						value={filters.category}
						onChange={(event) =>
							setFilters((prev) => ({
								...prev,
								category: event.target.value,
							}))
						}
					>
						<option value="">All categories</option>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
					<div className="flex items-center gap-2">
						<Calendar className="h-4 w-4 text-muted-foreground" />
						<Input
							type="date"
							value={filters.from}
							onChange={(event) =>
								setFilters((prev) => ({
									...prev,
									from: event.target.value,
								}))
							}
						/>
						<span className="text-xs text-muted-foreground">to</span>
						<Input
							type="date"
							value={filters.to}
							onChange={(event) =>
								setFilters((prev) => ({
									...prev,
									to: event.target.value,
								}))
							}
						/>
					</div>
				</div>
			</Card>

			<div className="space-y-4">
				{isLoading ? (
					Array.from({ length: 3 }).map((_, index) => (
						<Card key={index} className="space-y-3">
							<Skeleton className="h-5 w-40" />
							<Skeleton className="h-8 w-24" />
							<Skeleton className="h-4 w-full" />
						</Card>
					))
				) : data && data.items.length > 0 ? (
					data.items.map((transaction) => {
						const isIncome = transaction.type === "INCOME";
						return (
							<Card key={transaction.id} className="flex flex-col gap-3">
								<div className="flex items-start justify-between">
									<div>
										<p className="font-semibold text-foreground">
											{transaction.title}
										</p>
										<p className="text-sm text-muted-foreground">
											{transaction.category} • {transaction.date}
										</p>
									</div>
									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => openEdit(transaction)}
											aria-label="Edit transaction"
										>
											<Pencil size={16} />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleDelete(transaction)}
											aria-label="Delete transaction"
										>
											<Trash2 size={16} />
										</Button>
									</div>
								</div>
								<div className="flex flex-wrap items-center justify-between gap-3">
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										{transaction.recurring ? (
											<span className="rounded-full bg-muted/70 px-3 py-1 text-xs">
												Recurring
											</span>
										) : null}
										{transaction.note ? (
											<span className="text-xs">{transaction.note}</span>
										) : null}
									</div>
									<div className="flex items-center gap-2 text-lg font-semibold">
										{isIncome ? (
											<ArrowUpRight className="h-5 w-5 text-emerald-500" />
										) : (
											<ArrowDownRight className="h-5 w-5 text-rose-500" />
										)}
										<span className={isIncome ? "text-emerald-500" : "text-rose-500"}>
											{isIncome ? "+" : "-"}${transaction.amount.toFixed(2)}
										</span>
									</div>
								</div>
							</Card>
						);
					})
				) : (
					<Card className="flex flex-col items-center gap-3 py-12 text-center">
						<p className="font-display text-lg font-semibold">No transactions yet</p>
						<p className="max-w-sm text-sm text-muted-foreground">
							Add your first transaction to start seeing insights.
						</p>
						<Button onClick={openCreate}>Add transaction</Button>
					</Card>
				)}
			</div>

			{data ? (
				<div className="flex items-center justify-between text-sm text-muted-foreground">
					<p>
						Page {data.page + 1} of {Math.max(totalPages, 1)}
					</p>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							disabled={page === 0}
							onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							disabled={page + 1 >= totalPages}
							onClick={() => setPage((prev) => prev + 1)}
						>
							Next
						</Button>
					</div>
				</div>
			) : null}

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{editing ? "Edit transaction" : "Add transaction"}
						</DialogTitle>
						<DialogDescription>
							Capture every movement with clarity and confidence.
						</DialogDescription>
					</DialogHeader>
					<TransactionForm
						initial={editing}
						onCancel={() => setIsDialogOpen(false)}
						onSubmit={editing ? handleUpdate : handleCreate}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
