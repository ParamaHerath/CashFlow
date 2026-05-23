"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Plus } from "lucide-react";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

const getInitials = (name?: string) => {
	if (!name) return "CF";
	const parts = name.trim().split(/\s+/);
	if (parts.length === 0) return "CF";
	if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
	const firstInitial = parts[0][0] || "";
	const lastInitial = parts[parts.length - 1][0] || "";
	return (firstInitial + lastInitial).toUpperCase();
};

const PAGE_TITLES: Record<string, string> = {
	"/dashboard": "Dashboard",
	"/transactions": "Transactions",
	"/categories": "Categories",
	"/budgets": "Budgets",
	"/analytics": "Analytics",
	"/settings": "Settings",
	"/profile": "Profile",
};

export function TopNav() {
	const user = useAuthStore((state) => state.user);
	const initials = getInitials(user?.fullName);
	const pathname = usePathname();
	const pageTitle = PAGE_TITLES[pathname] ?? "";

	return (
		<header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 px-6 py-3.5 backdrop-blur">
			<div className="flex items-center justify-between">
				{/* Page title */}
				<h1 className="font-display text-xl font-bold tracking-tight">
					{pageTitle}
				</h1>
				<div className="flex items-center gap-3">
					<Button variant="outline" size="sm" className="hidden sm:flex rounded-xl gap-2 font-medium">
						<Plus size={16} />
						New transaction
					</Button>
					<Button variant="ghost" size="icon" className="rounded-xl relative" aria-label="Notifications">
						<Bell size={18} />
						<span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-primary" />
					</Button>
					<ThemeToggle />

					{/* User DP Avatar */}
					<Link href="/profile" title={user?.fullName || "Profile"}>
						<div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary via-accent to-primary text-sm font-semibold tracking-wider text-primary-foreground shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-primary/20 hover:shadow-lg border border-primary-foreground/10 select-none">
							{initials}
						</div>
					</Link>
				</div>
			</div>
		</header>
	);
}
