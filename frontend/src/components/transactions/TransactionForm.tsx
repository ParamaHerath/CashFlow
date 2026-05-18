"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Transaction, TransactionPayload, TransactionType } from "@/types/transactions";

const schema = z.object({
	title: z.string().min(2, "Add a short title"),
	amount: z.coerce.number().positive("Amount must be greater than zero"),
	type: z.enum(["INCOME", "EXPENSE"]),
	category: z.string().min(2, "Choose a category"),
	date: z.string().min(1, "Pick a date"),
	note: z.string().max(500, "Note is too long").optional(),
	recurring: z.boolean().default(false),
});

type FormValues = z.infer<typeof schema>;

type TransactionFormProps = {
	initial?: Transaction | null;
	onSubmit: (payload: TransactionPayload) => Promise<void>;
	onCancel: () => void;
	isSubmitting?: boolean;
};

export function TransactionForm({
	initial,
	onSubmit,
	onCancel,
	isSubmitting,
}: TransactionFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			title: initial?.title ?? "",
			amount: initial?.amount ?? 0,
			type: (initial?.type as TransactionType) ?? "EXPENSE",
			category: initial?.category ?? "",
			date: initial?.date ?? new Date().toISOString().slice(0, 10),
			note: initial?.note ?? "",
			recurring: initial?.recurring ?? false,
		},
	});

	const submitHandler = async (values: FormValues) => {
		await onSubmit({
			title: values.title,
			amount: values.amount,
			type: values.type,
			category: values.category,
			note: values.note,
			date: values.date,
			recurring: values.recurring,
		});
	};

	return (
		<form className="space-y-5" onSubmit={handleSubmit(submitHandler)}>
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-2">
					<label className="text-sm font-medium">Title</label>
					<Input placeholder="Coffee with clients" {...register("title")} />
					{errors.title ? (
						<p className="text-xs text-red-500">{errors.title.message}</p>
					) : null}
				</div>
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
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-2">
					<label className="text-sm font-medium">Type</label>
					<select
						className="flex h-11 w-full rounded-2xl border border-input bg-card/70 px-4 text-sm text-foreground shadow-sm shadow-black/5"
						{...register("type")}
					>
						<option value="EXPENSE">Expense</option>
						<option value="INCOME">Income</option>
					</select>
				</div>
				<div className="space-y-2">
					<label className="text-sm font-medium">Category</label>
					<Input placeholder="Food" {...register("category")} />
					{errors.category ? (
						<p className="text-xs text-red-500">{errors.category.message}</p>
					) : null}
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-2">
					<label className="text-sm font-medium">Date</label>
					<Input type="date" {...register("date")} />
					{errors.date ? (
						<p className="text-xs text-red-500">{errors.date.message}</p>
					) : null}
				</div>
				<label className="flex items-center gap-2 text-sm font-medium">
					<input
						type="checkbox"
						className="h-4 w-4 rounded border border-input"
						{...register("recurring")}
					/>
					Recurring transaction
				</label>
			</div>

			<div className="space-y-2">
				<label className="text-sm font-medium">Note</label>
				<Textarea placeholder="Optional details" {...register("note")} />
				{errors.note ? (
					<p className="text-xs text-red-500">{errors.note.message}</p>
				) : null}
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Saving..." : "Save transaction"}
				</Button>
			</div>
		</form>
	);
}
