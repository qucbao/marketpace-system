import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeader({
  className,
  eyebrow,
  title,
  description,
  action,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 border-b border-[var(--border)] pb-7 md:flex-row md:items-end md:justify-between",
        className,
      )}
      {...props}
    >
      <div className="max-w-3xl space-y-3">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-[2.5rem]">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
