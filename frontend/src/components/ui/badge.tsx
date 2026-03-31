import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type BadgeVariant = "neutral" | "accent" | "outline";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const badgeClasses: Record<BadgeVariant, string> = {
  neutral: "border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--foreground)]",
  accent: "border border-[var(--accent-soft)] bg-[var(--accent-soft)] text-[var(--accent-strong)]",
  outline: "bg-transparent text-[var(--muted)] border border-[var(--border)]",
};

export function Badge({
  className,
  variant = "neutral",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
        badgeClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
