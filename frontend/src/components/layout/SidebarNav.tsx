"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	ArrowLeftRight,
	LayoutGrid,
	LogOut,
	PieChart,
	Settings,
	Tags,
	Wallet,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

const navItems = [
	{ label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
	{ label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
	{ label: "Categories", href: "/categories", icon: Tags },
	{ label: "Budgets", href: "/budgets", icon: Wallet },
	{ label: "Analytics", href: "/analytics", icon: PieChart },
	{ label: "Settings", href: "/settings", icon: Settings },
];

export function SidebarNav() {
	const logout = useAuthStore((state) => state.logout);
	const router = useRouter();
	const pathname = usePathname();

	const handleLogout = async () => {
		await logout();
		router.push("/login");
	};

	return (
		<div className="relative hidden w-20 shrink-0 lg:block">
			<aside className="group/sidebar absolute left-0 top-0 z-40 flex h-full w-20 flex-col border-r border-border/60 bg-gradient-to-b from-card/90 via-card/75 to-primary/8 pt-8 pb-0 shadow-[0_20px_60px_-40px_hsl(var(--shadow-color)_/_0.5)] backdrop-blur transition-all duration-300 ease-in-out hover:w-72">
				<div className="flex items-center gap-3 px-[18px]">
					<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary via-accent to-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30">
						CF
					</div>
					<div className="flex flex-col transition-all duration-300 opacity-0 group-hover/sidebar:opacity-100 w-0 group-hover/sidebar:w-48 overflow-hidden whitespace-nowrap">
						<p className="font-display text-lg font-semibold">CashFlow</p>
						<p className="text-xs text-muted-foreground">Personal finance studio</p>
					</div>
				</div>

				<nav className="mt-10 flex flex-1 flex-col">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.label}
								href={item.href}
								className={`group relative flex w-full items-center gap-4 px-8 py-[18px] text-sm font-medium transition-all ${
									isActive
										? "bg-primary/10 text-primary font-semibold"
										: "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
								}`}
							>
								{isActive && (
									<div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-primary to-accent" />
								)}
								<Icon className="h-4 w-4 shrink-0" />
								<span className="transition-all duration-300 opacity-0 group-hover/sidebar:opacity-100 w-0 group-hover/sidebar:w-40 overflow-hidden whitespace-nowrap">
									{item.label}
								</span>
							</Link>
						);
					})}
				</nav>

				<button
					onClick={handleLogout}
					className="group mt-auto flex w-full items-center gap-4 px-8 py-[18px] text-sm font-medium text-muted-foreground transition hover:bg-red-500/10 hover:text-red-500"
				>
					<LogOut className="h-4 w-4 shrink-0" />
					<span className="transition-all duration-300 opacity-0 group-hover/sidebar:opacity-100 w-0 group-hover/sidebar:w-40 overflow-hidden whitespace-nowrap">
						Logout
					</span>
				</button>
			</aside>
		</div>
	);
}
