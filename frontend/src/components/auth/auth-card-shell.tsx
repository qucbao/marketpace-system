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
    <PageContainer className="flex min-h-screen items-center justify-center py-10 relative overflow-hidden bg-slate-50/50">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[440px] px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <Card className="border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl bg-white/80 rounded-[2.5rem] overflow-hidden border">
          <CardHeader className="space-y-4 pt-12 pb-6 px-10 text-center">
            <div className="flex flex-col items-center gap-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 bg-primary/5 px-3 py-1 rounded-full">
                {eyebrow}
              </p>
              <CardTitle className="text-3xl font-black text-slate-900 tracking-tight mt-3">{title}</CardTitle>
            </div>
            <CardDescription className="text-slate-500 font-medium leading-relaxed">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-12">
            {children}
          </CardContent>
        </Card>

        <div className="mt-8 text-center animate-in fade-in duration-1000 delay-500">
          <p className="text-sm font-medium text-slate-400">
            {footerText}{" "}
            <Link
              href={footerLinkHref}
              className="font-bold text-primary hover:text-primary/80 transition-colors underline-offset-4 decoration-2"
            >
              {footerLinkLabel}
            </Link>
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
