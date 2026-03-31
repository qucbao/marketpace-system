import type { HTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function FormField({
  className,
  children,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {children}
    </div>
  );
}

export function FormLabel({
  className,
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "block text-sm font-medium text-[var(--foreground)]",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}

export function FormMessage({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-[var(--muted)]", className)} {...props}>
      {children}
    </p>
  );
}
