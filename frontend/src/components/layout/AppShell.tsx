import type { ReactNode } from "react";

import { SidebarNav } from "@/components/layout/SidebarNav";
import { TopNav } from "@/components/layout/TopNav";

export function AppShell({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen w-full bg-transparent">
			<SidebarNav />
			<div className="flex min-h-screen flex-1 flex-col">
				<TopNav />
				<main className="flex-1 px-6 pb-10 pt-6 lg:px-10">
					{children}
				</main>
			</div>
		</div>
	);
}
