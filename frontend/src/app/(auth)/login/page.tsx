"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/authStore";

const schema = z.object({
	email: z.string().email("Enter a valid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

function LoginForm() {
	const router = useRouter();
	const params = useSearchParams();
	const nextPath = params.get("next") ?? "/dashboard";
	const { login, isLoading } = useAuthStore();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({ resolver: zodResolver(schema) });

	const onSubmit = async (values: FormValues) => {
		try {
			await login(values.email, values.password);
			toast.success("Welcome back to CashFlow");
			router.replace(nextPath);
		} catch (error) {
			toast.error((error as Error).message);
		}
	};

	return (
		<Card className="w-full max-w-md space-y-6 border border-border/60 bg-card/80 p-8">
			<div className="space-y-2">
				<p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
					Sign in
				</p>
				<h1 className="font-display text-2xl font-semibold">
					Welcome back
				</h1>
				<p className="text-sm text-muted-foreground">
					Pick up where you left off and see your finances in motion.
				</p>
			</div>

			<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
					{isSubmitting || isLoading ? "Signing in..." : "Sign in"}
				</Button>
			</form>

			<p className="text-sm text-muted-foreground">
				New to CashFlow?{" "}
				<Link className="font-semibold text-foreground" href="/register">
					Create an account
				</Link>
			</p>
		</Card>
	);
}

export default function LoginPage() {
	return (
		<Suspense fallback={
			<Card className="w-full max-w-md space-y-6 border border-border/60 bg-card/80 p-8 flex flex-col items-center justify-center min-h-[350px]">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
				<p className="text-sm text-muted-foreground mt-4">Loading authorization...</p>
			</Card>
		}>
			<LoginForm />
		</Suspense>
	);
}

