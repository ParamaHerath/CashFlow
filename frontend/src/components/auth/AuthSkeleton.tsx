import { Skeleton } from "@/components/ui/skeleton";

export function AuthSkeleton() {
	return (
		<div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-20">
			<Skeleton className="h-10 w-48" />
			<div className="grid gap-4 sm:grid-cols-2">
				<Skeleton className="h-40" />
				<Skeleton className="h-40" />
			</div>
			<Skeleton className="h-72" />
		</div>
	);
}
