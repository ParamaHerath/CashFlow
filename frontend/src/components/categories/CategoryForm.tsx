"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { iconOptions } from "@/components/categories/CategoryIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category, CategoryPayload } from "@/types/categories";

const schema = z.object({
	name: z.string().min(2, "Category name is required"),
	color: z.string().min(4, "Pick a color"),
	icon: z.string().min(2, "Pick an icon"),
});

type FormValues = z.infer<typeof schema>;

type CategoryFormProps = {
	initial?: Category | null;
	onSubmit: (payload: CategoryPayload) => Promise<void>;
	onCancel: () => void;
	isSubmitting?: boolean;
};

export function CategoryForm({
	initial,
	onSubmit,
	onCancel,
	isSubmitting,
}: CategoryFormProps) {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: initial?.name ?? "",
			color: initial?.color ?? "#3B82F6",
			icon: initial?.icon ?? iconOptions[0].value,
		},
	});

	const selectedIcon = watch("icon");
	const SelectedIcon = iconOptions.find((option) => option.value === selectedIcon)?.Icon;

	const submitHandler = async (values: FormValues) => {
		await onSubmit({
			name: values.name,
			color: values.color,
			icon: values.icon,
		});
	};

	return (
		<form className="space-y-5" onSubmit={handleSubmit(submitHandler)}>
			<div className="space-y-2">
				<label className="text-sm font-medium">Name</label>
				<Input placeholder="Food" {...register("name")} />
				{errors.name ? (
					<p className="text-xs text-red-500">{errors.name.message}</p>
				) : null}
			</div>

			<div className="grid gap-4 sm:grid-cols-[1fr_auto]">
				<div className="space-y-2">
					<label className="text-sm font-medium">Color</label>
					<Input type="color" className="h-11 p-1" {...register("color")} />
					{errors.color ? (
						<p className="text-xs text-red-500">{errors.color.message}</p>
					) : null}
				</div>
				<div className="flex items-end justify-center">
					<div
						className="flex h-11 w-11 items-center justify-center rounded-2xl"
						style={{ backgroundColor: watch("color") }}
					>
						{SelectedIcon ? <SelectedIcon className="h-5 w-5 text-white" /> : null}
					</div>
				</div>
			</div>

			<div className="space-y-2">
				<label className="text-sm font-medium">Icon</label>
				<select
					className="h-11 w-full rounded-2xl border border-input bg-card/70 px-4 text-sm"
					{...register("icon")}
				>
					{iconOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				{errors.icon ? (
					<p className="text-xs text-red-500">{errors.icon.message}</p>
				) : null}
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Saving..." : "Save category"}
				</Button>
			</div>
		</form>
	);
}
