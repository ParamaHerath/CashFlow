import Link from "next/link";
import {
	ArrowLeftRight,
	LayoutGrid,
	PieChart,
	Settings,
	Tags,
	Wallet,
} from "lucide-react";

const navItems = [
	{ label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
	{ label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
	{ label: "Categories", href: "/categories", icon: Tags },
	{ label: "Budgets", href: "/budgets", icon: Wallet },
	{ label: "Analytics", href: "/analytics", icon: PieChart },
	{ label: "Settings", href: "/settings", icon: Settings },
];

export function SidebarNav() {
	return (
		<aside className="hidden w-72 shrink-0 border-r border-border/60 bg-card/60 px-6 py-8 shadow-[0_20px_60px_-40px_hsl(var(--shadow-color)_/_0.5)] backdrop-blur lg:flex lg:flex-col">
			<div className="flex items-center gap-3">
				<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-accent to-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30">
					CF
				</div>
				<div>
					<p className="font-display text-lg font-semibold">CashFlow</p>
					<p className="text-xs text-muted-foreground">Personal finance studio</p>
				</div>
			</div>

			<nav className="mt-10 flex flex-1 flex-col gap-2">
				{navItems.map((item) => {
					const Icon = item.icon;
					return (
						<Link
							key={item.label}
							href={item.href}
							className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
						>
							<Icon className="h-4 w-4" />
							<span>{item.label}</span>
						</Link>
					);
				})}
			</nav>

			<div className="rounded-3xl border border-border/60 bg-gradient-to-br from-background via-background to-muted/80 p-4 text-xs text-muted-foreground">
				<p className="font-semibold text-foreground">CashFlow Beta</p>
				<p className="mt-1">
					Keep your money calm and clear. New insights land weekly.
				</p>
			</div>
		</aside>
	);
}
