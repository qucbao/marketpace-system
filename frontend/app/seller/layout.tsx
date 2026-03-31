"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";
import { SellerSidebar } from "@/components/layout/seller-sidebar";
import { SellerHeader } from "@/components/layout/seller-header";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Nếu ứng dụng load xong Auth mà:
    // 1. User chưa login
    // 2. Chức vụ không có quyền "SELLER" lẫn "ADMIN"
    if (!loading) {
      if (!isAuthenticated || user?.role === "USER") {
        router.replace("/");
      } else {
         // Chấp nhận SELLER hoặc ADMIN (Admin có quyền xem giao diện seller - optional theo design RBAC)
        setIsAuthorized(true);
      }
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent shadow-lg" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Đang tải dữ liệu Kênh Người Bán...
          </p>
        </div>
      </div>
    );
  }

  // Render Kênh Người bán
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 relative">
      <SellerSidebar />
      <div className="flex flex-1 flex-col md:pl-64 transition-all w-full">
        <SellerHeader />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
