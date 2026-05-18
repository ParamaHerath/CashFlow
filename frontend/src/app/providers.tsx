"use client";

import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useAuthStore } from "@/stores/authStore";

export function Providers({ children }: { children: React.ReactNode }) {
	const bootstrap = useAuthStore((state) => state.bootstrap);

	useEffect(() => {
		bootstrap();
	}, [bootstrap]);

	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			{children}
			<Toaster richColors closeButton />
		</ThemeProvider>
	);
}
