import type { HTMLAttributes, ReactNode } from "react";

import { AlertTriangle, Inbox, LoaderCircle } from "lucide-react";

import { cn } from "@/lib/cn";

interface AsyncStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: ReactNode;
}

function AsyncStateShell({
  className,
  title,
  description,
  icon,
  ...props
}: AsyncStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-14 text-center",
        className,
      )}
      {...props}
    >
      <div className="mb-4 text-muted-foreground">{icon}</div>
      <p className="text-lg font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

export function LoadingState({
  title = "Loading...",
  description,
  className,
  ...props
}: Omit<AsyncStateProps, "icon">) {
  return (
    <AsyncStateShell
      title={title}
      description={description}
      icon={<LoaderCircle className="h-10 w-10 animate-spin" />}
      className={cn("bg-muted/20", className)}
      {...props}
    />
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  className,
  ...props
}: Omit<AsyncStateProps, "icon">) {
  return (
    <AsyncStateShell
      title={title}
      description={description}
      icon={<AlertTriangle className="h-10 w-10 text-red-500" />}
      className={cn("border-red-200 bg-red-50/30", className)}
      {...props}
    />
  );
}

export function EmptyState({
  title,
  description,
  className,
  ...props
}: Omit<AsyncStateProps, "icon">) {
  return (
    <AsyncStateShell
      title={title}
      description={description}
      icon={<Inbox className="h-10 w-10 opacity-50" />}
      className={cn("bg-muted/5", className)}
      {...props}
    />
  );
}
