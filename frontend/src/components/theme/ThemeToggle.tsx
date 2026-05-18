"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
	const { theme, setTheme, systemTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	// eslint-disable-next-line react-hooks/set-state-in-effect
	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button variant="ghost" size="icon" aria-label="Toggle theme" disabled />
		);
	}

	const currentTheme = theme === "system" ? systemTheme : theme;
	const nextTheme = currentTheme === "dark" ? "light" : "dark";

	return (
		<Button
			variant="ghost"
			size="icon"
			aria-label="Toggle theme"
			onClick={() => setTheme(nextTheme)}
		>
			{currentTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
		</Button>
	);
}
