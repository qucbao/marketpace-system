import Link from "next/link";

import {
  AppShell,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  SectionHeader,
} from "@/components/ui";

interface RoutePlaceholderProps {
  eyebrow: string;
  title: string;
  description: string;
  path: string;
}

export function RoutePlaceholder({
  eyebrow,
  title,
  description,
  path,
}: RoutePlaceholderProps) {
  return (
    <AppShell>
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={<Badge variant="outline">Scaffold</Badge>}
      />

      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Route Foundation</CardTitle>
          <CardDescription>
            This screen is intentionally minimal so page work can build on top of the shared design system.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--muted)]">
            <span className="font-medium text-[var(--foreground)]">Route:</span> {path}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center border border-[var(--accent)] bg-[var(--accent)] px-4 text-sm font-medium text-white transition-colors hover:border-[var(--accent-strong)] hover:bg-[var(--accent-strong)]"
            >
              Back to Foundation
            </Link>
            <Link href="/products">
              <span className="inline-flex h-10 items-center justify-center border border-[var(--border)] bg-white px-4 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--surface-subtle)]">
                Browse Products
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
