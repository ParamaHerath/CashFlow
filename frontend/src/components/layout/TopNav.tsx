"use client";

import { Bell, Plus } from "lucide-react";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

export function TopNav() {
	const user = useAuthStore((state) => state.user);
	const firstName = user?.fullName?.split(" ")[0];

	return (
		<header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 px-6 py-4 backdrop-blur">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
						Overview
					</p>
					<h1 className="font-display text-xl font-semibold">
						Welcome back{firstName ? `, ${firstName}` : ""}!
					</h1>
				</div>
				<div className="flex items-center gap-3">
					<Button variant="outline" size="sm">
						<Plus size={16} />
						New transaction
					</Button>
					<Button variant="ghost" size="icon" aria-label="Notifications">
						<Bell size={18} />
					</Button>
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
