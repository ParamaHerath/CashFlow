"use client";

import { Card } from "@/components/ui/card";

export default function SettingsPage() {
	return (
		<div className="space-y-6">
			<div>
				<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
					Settings
				</p>
				<h2 className="font-display text-2xl font-semibold">
					Preferences and safeguards
				</h2>
			</div>

			<div className="grid gap-4 xl:grid-cols-2">
				<Card className="space-y-4">
					<h3 className="font-semibold">Notifications</h3>
					<div className="flex items-center justify-between text-sm">
						<div>
							<p className="font-medium">Budget alerts</p>
							<p className="text-muted-foreground">Warn when you hit 80%</p>
						</div>
						<input type="checkbox" className="h-4 w-4" defaultChecked />
					</div>
					<div className="flex items-center justify-between text-sm">
						<div>
							<p className="font-medium">Weekly digest</p>
							<p className="text-muted-foreground">Summary every Monday</p>
						</div>
						<input type="checkbox" className="h-4 w-4" defaultChecked />
					</div>
				</Card>

				<Card className="space-y-4">
					<h3 className="font-semibold">Security</h3>
					<div className="flex items-center justify-between text-sm">
						<div>
							<p className="font-medium">Two-factor authentication</p>
							<p className="text-muted-foreground">Require a second factor</p>
						</div>
						<input type="checkbox" className="h-4 w-4" />
					</div>
					<div className="flex items-center justify-between text-sm">
						<div>
							<p className="font-medium">Login alerts</p>
							<p className="text-muted-foreground">Notify on new devices</p>
						</div>
						<input type="checkbox" className="h-4 w-4" defaultChecked />
					</div>
				</Card>

				<Card className="space-y-4">
					<h3 className="font-semibold">Experience</h3>
					<div className="flex items-center justify-between text-sm">
						<div>
							<p className="font-medium">Hide cents</p>
							<p className="text-muted-foreground">Round to whole dollars</p>
						</div>
						<input type="checkbox" className="h-4 w-4" />
					</div>
					<div className="flex items-center justify-between text-sm">
						<div>
							<p className="font-medium">Compact layout</p>
							<p className="text-muted-foreground">Reduce card spacing</p>
						</div>
						<input type="checkbox" className="h-4 w-4" />
					</div>
				</Card>

				<Card className="space-y-4">
					<h3 className="font-semibold">Data controls</h3>
					<div className="flex items-center justify-between text-sm">
						<div>
							<p className="font-medium">Auto export</p>
							<p className="text-muted-foreground">Monthly CSV backup</p>
						</div>
						<input type="checkbox" className="h-4 w-4" />
					</div>
					<div className="flex items-center justify-between text-sm">
						<div>
							<p className="font-medium">Analytics sharing</p>
							<p className="text-muted-foreground">Help improve insights</p>
						</div>
						<input type="checkbox" className="h-4 w-4" defaultChecked />
					</div>
				</Card>
			</div>
		</div>
	);
}
