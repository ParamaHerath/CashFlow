import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
	return (
		<div className="space-y-6">
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{Array.from({ length: 4 }).map((_, index) => (
					<Card key={index} className="space-y-3">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-8 w-32" />
					</Card>
				))}
			</div>
			<div className="grid gap-4 xl:grid-cols-2">
				<Card className="space-y-3">
					<Skeleton className="h-6 w-32" />
					<Skeleton className="h-64 w-full" />
				</Card>
				<Card className="space-y-3">
					<Skeleton className="h-6 w-32" />
					<Skeleton className="h-64 w-full" />
				</Card>
			</div>
		</div>
	);
}
