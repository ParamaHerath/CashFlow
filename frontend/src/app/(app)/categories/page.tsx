"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { CategoryForm } from "@/components/categories/CategoryForm";
import { resolveCategoryIcon } from "@/components/categories/CategoryIcon";
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
import {
	createCategory,
	deleteCategory,
	fetchCategories,
	updateCategory,
} from "@/lib/categories";
import type { Category, CategoryPayload } from "@/types/categories";

export default function CategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editing, setEditing] = useState<Category | null>(null);

	const loadCategories = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await fetchCategories();
			setCategories(data);
		} catch {
			toast.error("Unable to load categories");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		loadCategories();
	}, [loadCategories]);

	const filtered = useMemo(() => {
		const trimmed = query.trim().toLowerCase();
		if (!trimmed) {
			return categories;
		}
		return categories.filter((category) =>
			category.name.toLowerCase().includes(trimmed)
		);
	}, [categories, query]);

	const totalMonthly = useMemo(() => {
		return categories.reduce((sum, category) => sum + category.monthlyTotal, 0);
	}, [categories]);

	const openCreate = () => {
		setEditing(null);
		setIsDialogOpen(true);
	};

	const openEdit = (category: Category) => {
		setEditing(category);
		setIsDialogOpen(true);
	};

	const handleCreate = async (payload: CategoryPayload) => {
		await createCategory(payload);
		toast.success("Category created");
		setIsDialogOpen(false);
		loadCategories();
	};

	const handleUpdate = async (payload: CategoryPayload) => {
		if (!editing) {
			return;
		}
		await updateCategory(editing.id, payload);
		toast.success("Category updated");
		setIsDialogOpen(false);
		setEditing(null);
		loadCategories();
	};

	const handleDelete = async (category: Category) => {
		const confirmed = window.confirm(`Delete ${category.name}?`);
		if (!confirmed) {
			return;
		}
		try {
			await deleteCategory(category.id);
			toast.success("Category deleted");
			loadCategories();
		} catch {
			toast.error("Unable to delete category");
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
						Categories
					</p>
					<h2 className="font-display text-2xl font-semibold">
						Your spending DNA
					</h2>
				</div>
				<Button onClick={openCreate}>
					<Plus size={18} />
					New category
				</Button>
			</div>

			<Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<p className="text-sm text-muted-foreground">Monthly spend</p>
					<p className="font-display text-2xl font-semibold">
						${totalMonthly.toFixed(2)}
					</p>
				</div>
				<div className="flex-1 max-w-md">
					<div className="relative">
						<Input
							placeholder="Search categories"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
						/>
					</div>
				</div>
			</Card>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{isLoading ? (
					Array.from({ length: 6 }).map((_, index) => (
						<Card key={index} className="space-y-3">
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-4 w-48" />
							<Skeleton className="h-2 w-full" />
						</Card>
					))
				) : filtered.length ? (
					filtered.map((category) => {
						const Icon = resolveCategoryIcon(category.icon);
						return (
							<Card key={category.id} className="space-y-4">
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-3">
										<div
											className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
											style={{ backgroundColor: category.color }}
										>
											<Icon className="h-5 w-5" />
										</div>
										<div>
											<p className="font-semibold">{category.name}</p>
											<p className="text-sm text-muted-foreground">
												${category.monthlyTotal.toFixed(2)} this month
											</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => openEdit(category)}
											aria-label="Edit category"
										>
											<Pencil size={16} />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleDelete(category)}
											aria-label="Delete category"
										>
											<Trash2 size={16} />
										</Button>
									</div>
								</div>
								<div>
									<div className="flex items-center justify-between text-xs text-muted-foreground">
										<span>Expense share</span>
										<span>{category.expenseShare.toFixed(2)}%</span>
									</div>
									<div className="mt-2 h-2 rounded-full bg-muted/70">
										<div
											className="h-full rounded-full"
											style={{
												width: `${Math.min(category.expenseShare, 100)}%`,
												backgroundColor: category.color,
											}}
										/>
									</div>
								</div>
							</Card>
						);
					})
				) : (
					<Card className="col-span-full flex flex-col items-center gap-3 py-12 text-center">
						<p className="font-display text-lg font-semibold">No categories found</p>
						<p className="max-w-sm text-sm text-muted-foreground">
							Create a category to start organizing your spending.
						</p>
						<Button onClick={openCreate}>Create category</Button>
					</Card>
				)}
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{editing ? "Edit category" : "Create category"}
						</DialogTitle>
						<DialogDescription>
							Add the categories that shape your spending story.
						</DialogDescription>
					</DialogHeader>
					<CategoryForm
						initial={editing}
						onCancel={() => setIsDialogOpen(false)}
						onSubmit={editing ? handleUpdate : handleCreate}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
