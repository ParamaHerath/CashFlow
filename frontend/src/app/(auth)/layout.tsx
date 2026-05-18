import type { ReactNode } from "react";
import Link from "next/link";
import { Sparkles, TrendingUp, Wallet } from "lucide-react";

import { AuthBackdrop } from "@/components/auth/AuthBackdrop";
import { Button } from "@/components/ui/button";

const highlights = [
	{
		icon: TrendingUp,
		title: "Live insights",
		copy: "See cash flow shifts as they happen, not weeks later.",
	},
	{
		icon: Wallet,
		title: "Gentle budgets",
		copy: "Track spend in context with calm, color-coded guidance.",
	},
	{
		icon: Sparkles,
		title: "Personalized views",
		copy: "Design a dashboard that mirrors the way you think.",
	},
];

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="relative min-h-screen overflow-hidden">
			<AuthBackdrop />
			<div className="relative z-10 grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
				<div className="hidden flex-col justify-between border-r border-border/60 bg-card/50 p-12 lg:flex">
					<div>
						<div className="flex items-center gap-3">
							<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-accent to-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30">
								CF
							</div>
							<div>
								<p className="font-display text-xl font-semibold">CashFlow</p>
								<p className="text-sm text-muted-foreground">Finance, distilled</p>
							</div>
						</div>
						<p className="mt-10 text-balance text-2xl font-display leading-snug">
							The premium personal finance studio for people who want calm, modern clarity.
						</p>
						<div className="mt-10 space-y-6">
							{highlights.map((item) => {
								const Icon = item.icon;
								return (
									<div key={item.title} className="flex gap-4">
										<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted/70 text-foreground">
											<Icon size={18} />
										</div>
										<div>
											<p className="font-semibold">{item.title}</p>
											<p className="text-sm text-muted-foreground">{item.copy}</p>
										</div>
									</div>
								);
							})}
						</div>
					</div>
					<Button asChild variant="outline" className="w-fit">
						<Link href="/">Back to homepage</Link>
					</Button>
				</div>
				<div className="flex items-center justify-center px-6 py-12">
					{children}
				</div>
			</div>
		</div>
	);
}
