"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	ArrowLeftRight,
	LayoutDashboard,
	LogOut,
	PieChart,
	Settings,
	Tags,
	Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";

const navItems = [
	{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
	{ label: "Categories", href: "/categories", icon: Tags },
	{ label: "Budgets", href: "/budgets", icon: Wallet },
	{ label: "Analytics", href: "/analytics", icon: PieChart },
	{ label: "Settings", href: "/settings", icon: Settings },
];

const sidebarItemClass =
	"group flex h-10 w-10 items-center justify-start gap-0 rounded-xl px-0 pl-[11px] text-sm font-medium transition-[background-color,color,width,padding,gap] duration-200 group-hover/sidebar:w-[16.5rem] group-hover/sidebar:gap-3.5 group-hover/sidebar:px-3";
const sidebarLabelClass =
	"max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity] duration-300 group-hover/sidebar:max-w-40 group-hover/sidebar:opacity-100";

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
			<aside className="group/sidebar absolute left-0 top-0 z-40 flex h-full w-20 flex-col border-r border-border/40 bg-card/65 dark:bg-card/40 shadow-[0_20px_60px_-40px_hsl(var(--shadow-color)_/_0.5)] backdrop-blur-lg transition-all duration-300 ease-in-out hover:w-72">
				{/* Logo / Brand Header */}
				<div className="flex items-center gap-3.5 px-3.5 pt-6 pb-2">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-accent to-primary text-sm font-bold tracking-wider text-primary-foreground shadow-md shadow-primary/20 transition-transform duration-300 hover:rotate-6 select-none">
						CF
					</div>
					<div className="flex flex-col transition-all duration-300 opacity-0 group-hover/sidebar:opacity-100 w-0 group-hover/sidebar:w-48 overflow-hidden whitespace-nowrap">
						<p className="font-display text-base font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
							CashFlow
						</p>
						<p className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
							Finance Studio
						</p>
					</div>
				</div>

				{/* Navigation Links */}
				<nav className="mt-8 flex flex-1 flex-col gap-1.5 px-3">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.label}
								href={item.href}
								className={cn(
									sidebarItemClass,
									isActive
										? "bg-primary/15 text-primary font-semibold"
										: "text-muted-foreground hover:bg-muted/75 hover:text-foreground",
								)}
							>
								<Icon className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-105" />
								<span className={sidebarLabelClass}>{item.label}</span>
							</Link>
						);
					})}

					{/* Logout Button */}
					<button
						onClick={handleLogout}
						className={cn(
							sidebarItemClass,
							"mt-auto mb-6 text-muted-foreground hover:bg-red-500/10 hover:text-red-500",
						)}
					>
						<LogOut className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-105" />
						<span className={sidebarLabelClass}>Logout</span>
					</button>
				</nav>
			</aside>
		</div>
	);
}
