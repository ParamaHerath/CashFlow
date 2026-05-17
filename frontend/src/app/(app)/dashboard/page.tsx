import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
	return (
		<div className="space-y-6">
			<div>
				<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
					Dashboard
				</p>
				<h2 className="font-display text-2xl font-semibold">
					CashFlow overview
				</h2>
			</div>
			<div className="grid gap-6 lg:grid-cols-3">
				{Array.from({ length: 3 }).map((_, index) => (
					<Card key={index} className="space-y-4">
						<Skeleton className="h-6 w-24" />
						<Skeleton className="h-10 w-32" />
						<Skeleton className="h-4 w-full" />
					</Card>
				))}
			</div>
			<Card className="space-y-4">
				<Skeleton className="h-6 w-32" />
				<Skeleton className="h-48 w-full" />
			</Card>
		</div>
	);
}
