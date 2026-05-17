import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesLoading() {
	return (
		<div className="space-y-6">
			<Card className="space-y-4">
				<Skeleton className="h-6 w-40" />
				<Skeleton className="h-11 w-full" />
			</Card>
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{Array.from({ length: 6 }).map((_, index) => (
					<Card key={index} className="space-y-3">
						<Skeleton className="h-6 w-32" />
						<Skeleton className="h-4 w-48" />
						<Skeleton className="h-2 w-full" />
					</Card>
				))}
			</div>
		</div>
	);
}
