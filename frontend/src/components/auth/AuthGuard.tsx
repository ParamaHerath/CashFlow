"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { AuthSkeleton } from "@/components/auth/AuthSkeleton";
import { useAuthStore } from "@/stores/authStore";

export function AuthGuard({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const { user, isLoading, hasBootstrapped, bootstrap } = useAuthStore();

	useEffect(() => {
		bootstrap();
	}, [bootstrap]);

	useEffect(() => {
		if (!isLoading && hasBootstrapped && !user) {
			router.replace(`/login?next=${encodeURIComponent(pathname ?? "/")}`);
		}
	}, [isLoading, hasBootstrapped, user, router, pathname]);

	if (isLoading || !hasBootstrapped) {
		return <AuthSkeleton />;
	}

	if (!user) {
		return null;
	}

	return <>{children}</>;
}
