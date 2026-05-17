import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionsLoading() {
	return (
		<div className="space-y-6">
			<Card className="space-y-4">
				<Skeleton className="h-6 w-48" />
				<div className="grid gap-3 md:grid-cols-3">
					<Skeleton className="h-11" />
					<Skeleton className="h-11" />
					<Skeleton className="h-11" />
				</div>
			</Card>
			{Array.from({ length: 3 }).map((_, index) => (
				<Card key={index} className="space-y-3">
					<Skeleton className="h-6 w-32" />
					<Skeleton className="h-4 w-40" />
					<Skeleton className="h-4 w-full" />
				</Card>
			))}
		</div>
	);
}
