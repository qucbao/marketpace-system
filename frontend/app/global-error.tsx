"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui";

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({
  error,
  reset,
}: GlobalErrorPageProps) {
  useEffect(() => {
    console.error("Global render error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--surface)] text-[var(--foreground)]">
        <main className="flex min-h-screen items-center justify-center px-6 py-16">
          <div className="w-full max-w-xl rounded-2xl border border-dashed bg-muted/10 px-6 py-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Application error
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-foreground">
              The app hit an unexpected problem.
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Try reloading this view. Error details are logged to the console for debugging.
            </p>
            <Button className="mt-6" onClick={reset}>
              Reload
            </Button>
          </div>
        </main>
      </body>
    </html>
  );
}
