"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Budget, BudgetPayload } from "@/types/budgets";
import type { Category } from "@/types/categories";

const schema = z.object({
	category: z.string().min(2, "Pick a category"),
	amount: z.coerce.number().positive("Amount must be greater than zero"),
	month: z.string().min(7, "Pick a month"),
});

type FormValues = z.infer<typeof schema>;

type BudgetFormProps = {
	initial?: Budget | null;
	categories: Category[];
	onSubmit: (payload: BudgetPayload) => Promise<void>;
	onCancel: () => void;
	isSubmitting?: boolean;
};

export function BudgetForm({
	initial,
	categories,
	onSubmit,
	onCancel,
	isSubmitting,
}: BudgetFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			category: initial?.category ?? "",
			amount: initial?.amount ?? 0,
			month: initial?.month ? initial.month.slice(0, 7) : new Date().toISOString().slice(0, 7),
		},
	});

	const submitHandler = async (values: FormValues) => {
		await onSubmit({
			category: values.category,
			amount: values.amount,
			month: `${values.month}-01`,
		});
	};

	return (
		<form className="space-y-5" onSubmit={handleSubmit(submitHandler)}>
			<div className="space-y-2">
				<label className="text-sm font-medium">Category</label>
				<select
					className="h-11 w-full rounded-2xl border border-input bg-card/70 px-4 text-sm"
					{...register("category")}
				>
					<option value="">Select a category</option>
					{categories.map((category) => (
						<option key={category.id} value={category.name}>
							{category.name}
						</option>
					))}
				</select>
				{errors.category ? (
					<p className="text-xs text-red-500">{errors.category.message}</p>
				) : null}
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-2">
					<label className="text-sm font-medium">Amount</label>
					<Input
						type="number"
						step="0.01"
						placeholder="0.00"
						{...register("amount", { valueAsNumber: true })}
					/>
					{errors.amount ? (
						<p className="text-xs text-red-500">{errors.amount.message}</p>
					) : null}
				</div>
				<div className="space-y-2">
					<label className="text-sm font-medium">Month</label>
					<Input type="month" {...register("month")} />
					{errors.month ? (
						<p className="text-xs text-red-500">{errors.month.message}</p>
					) : null}
				</div>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Saving..." : "Save budget"}
				</Button>
			</div>
		</form>
	);
}
