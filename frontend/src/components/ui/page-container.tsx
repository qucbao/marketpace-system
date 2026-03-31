import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function PageContainer({
  className,
  children,
  ...props
}: PageContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8", className)} {...props}>
      {children}
    </div>
  );
}
