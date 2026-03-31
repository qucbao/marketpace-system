import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-md border border-border bg-white px-3.5 text-sm text-[var(--foreground)] outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-muted/40",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
