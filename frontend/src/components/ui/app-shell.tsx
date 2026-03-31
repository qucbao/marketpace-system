import type { ReactNode } from "react";
import { PageContainer } from "@/components/ui/page-container";
import { cn } from "@/lib/cn";

export function AppShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Navbar bây giờ đã có sticky class */}
      <main className="flex-1">
        <PageContainer className={cn("py-6 md:py-8 lg:py-10", className)}>
          {children}
        </PageContainer>
      </main>

      {/* Senior Tip: Luôn dự phòng một Footer đơn giản để tạo cảm giác website hoàn chỉnh */}
      <footer className="border-t border-border bg-card py-8 text-center text-sm text-muted-foreground">
        © 2026 Marketplace Refactor. All rights reserved.
      </footer>
    </div>
  );
}
