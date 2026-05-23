"use client";

import { Mail, User } from "lucide-react";

import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores/authStore";

export default function ProfilePage() {
	const { user } = useAuthStore();

	return (
		<div className="space-y-6">
			<Card className="space-y-6">
				{user ? (
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
								<User size={20} />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Full name</p>
								<p className="font-semibold">{user.fullName}</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
								<Mail size={20} />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Email address</p>
								<p className="font-semibold">{user.email}</p>
							</div>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Role</p>
							<p className="font-semibold">{user.role}</p>
						</div>
					</div>
				) : (
					<p className="text-sm text-muted-foreground">
						Sign in to view your profile details.
					</p>
				)}
			</Card>
		</div>
	);
}
