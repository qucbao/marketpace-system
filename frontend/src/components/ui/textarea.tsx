import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, rows = 5, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(
        "w-full rounded-md border border-border bg-white px-3.5 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-muted/40",
        className,
      )}
      {...props}
    />
  );
}
