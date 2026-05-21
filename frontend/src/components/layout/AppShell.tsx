import type { ReactNode } from "react";

import { SidebarNav } from "@/components/layout/SidebarNav";
import { TopNav } from "@/components/layout/TopNav";

export function AppShell({ children }: { children: ReactNode }) {
	return (
		<div className="flex h-screen w-full overflow-hidden bg-transparent">
			<SidebarNav />
			<div className="flex h-screen flex-1 flex-col overflow-hidden">
				<TopNav />
				<main className="flex-1 overflow-y-auto px-6 pb-10 pt-6 lg:px-10">
					{children}
				</main>
			</div>
		</div>
	);
}
