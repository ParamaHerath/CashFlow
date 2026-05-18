import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, ...props }, ref) => {
		return (
			<textarea
				ref={ref}
				className={cn(
					"flex min-h-[120px] w-full rounded-2xl border border-input bg-card/70 px-4 py-3 text-sm text-foreground shadow-sm shadow-black/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
					className
				)}
				{...props}
			/>
		);
	}
);
Textarea.displayName = "Textarea";

export { Textarea };
