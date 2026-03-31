"use client";

import { useEffect } from "react";

import { Button, PageContainer } from "@/components/ui";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Route render error:", error);
  }, [error]);

  return (
    <PageContainer className="py-16">
      <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-dashed bg-muted/10 px-6 py-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Something went wrong
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">
          We could not render this page.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Try again. If the problem continues, check the console for more details.
        </p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </div>
    </PageContainer>
  );
}
