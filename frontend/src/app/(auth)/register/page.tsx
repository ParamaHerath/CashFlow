"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/authStore";

const schema = z.object({
	fullName: z.string().min(2, "Tell us your name"),
	email: z.string().email("Enter a valid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
	const router = useRouter();
	const { register: registerUser, isLoading } = useAuthStore();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({ resolver: zodResolver(schema) });

	const onSubmit = async (values: FormValues) => {
		try {
			await registerUser(values.fullName, values.email, values.password);
			toast.success("Account created. Welcome to CashFlow.");
			router.replace("/dashboard");
		} catch (error) {
			toast.error((error as Error).message);
		}
	};

	return (
		<Card className="w-full max-w-md space-y-6 border border-border/60 bg-card/80 p-8">
			<div className="space-y-2">
				<p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
					Create account
				</p>
				<h1 className="font-display text-2xl font-semibold">Start with clarity</h1>
				<p className="text-sm text-muted-foreground">
					Build your finance studio in under a minute.
				</p>
			</div>

			<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
				<div className="space-y-2">
					<label className="text-sm font-medium">Full name</label>
					<Input placeholder="Alex Rivera" {...register("fullName")} />
					{errors.fullName ? (
						<p className="text-xs text-red-500">{errors.fullName.message}</p>
					) : null}
				</div>
				<div className="space-y-2">
					<label className="text-sm font-medium">Email</label>
					<Input type="email" placeholder="you@cashflow.com" {...register("email")} />
					{errors.email ? (
						<p className="text-xs text-red-500">{errors.email.message}</p>
					) : null}
				</div>
				<div className="space-y-2">
					<label className="text-sm font-medium">Password</label>
					<Input type="password" placeholder="••••••••" {...register("password")} />
					{errors.password ? (
						<p className="text-xs text-red-500">{errors.password.message}</p>
					) : null}
				</div>
				<Button
					type="submit"
					className="w-full"
					disabled={isSubmitting || isLoading}
				>
					{isSubmitting || isLoading ? "Creating account..." : "Create account"}
				</Button>
			</form>

			<p className="text-sm text-muted-foreground">
				Already have an account?{" "}
				<Link className="font-semibold text-foreground" href="/login">
					Sign in
				</Link>
			</p>
		</Card>
	);
}
