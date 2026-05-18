"use client";

import { motion } from "framer-motion";

export function AuthBackdrop() {
	return (
		<div className="absolute inset-0 -z-10">
			<motion.div
				className="absolute left-1/2 top-16 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/25 blur-[120px]"
				animate={{ y: [0, 20, 0], opacity: [0.7, 0.9, 0.7] }}
				transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute right-12 top-32 h-96 w-96 rounded-full bg-accent/30 blur-[140px]"
				animate={{ y: [0, -16, 0], opacity: [0.6, 0.85, 0.6] }}
				transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="absolute bottom-24 left-16 h-72 w-72 rounded-full bg-primary/15 blur-[120px]"
				animate={{ y: [0, 14, 0], opacity: [0.55, 0.8, 0.55] }}
				transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
			/>
		</div>
	);
}
