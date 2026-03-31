"use client";

import type { ReactNode } from "react";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageContainer,
} from "@/components/ui";

interface AuthCardShellProps {
  eyebrow: string;
  title: string;
  description: string;
  footerText: string;
  footerLinkHref: string;
  footerLinkLabel: string;
  children: ReactNode;
}

export function AuthCardShell({
  eyebrow,
  title,
  description,
  footerText,
  footerLinkHref,
  footerLinkLabel,
  children,
}: AuthCardShellProps) {
  return (
    <PageContainer className="flex min-h-screen items-center justify-center py-16 sm:py-20">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-2 border-b border-[var(--border)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              {eyebrow}
            </p>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">{children}</CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          {footerText}{" "}
          <Link
            href={footerLinkHref}
            className="font-medium text-[var(--foreground)] underline underline-offset-4"
          >
            {footerLinkLabel}
          </Link>
        </p>
      </div>
    </PageContainer>
  );
}
