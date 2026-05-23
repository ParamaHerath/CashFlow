import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config = {
	darkMode: "class",
	content: ["./src/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-sans)"],
				display: ["var(--font-display)"],
			},
		},
	},
	plugins: [animate],
} satisfies Config;

export default config;
