"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminHeader } from "@/components/layout/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Nếu app đã loading xong Auth Session mà:
    // 1. User chưa login
    // 2. Chức vụ không phải là "ADMIN"
    // => đá thẳng về trang chủ (hoặc trang login tùy yêu cầu)
    if (!loading) {
      if (!isAuthenticated || user?.role !== "ADMIN") {
        router.replace("/");
      } else {
        setIsAuthorized(true); // Đã xác minh là ADMIN hợp lệ
      }
    }
  }, [isAuthenticated, user, loading, router]);

  // Trong lúc đang fetch thông tin auth hoặc đang chuyển hướng thì render UI Loading mượt mà.
  if (loading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Đang thẩm định quyền hạn hệ thống...
          </p>
        </div>
      </div>
    );
  }

  // Nếu là ADMIN, render bộ Layout riêng
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 relative">
      <AdminSidebar />
      <div className="flex flex-1 flex-col md:pl-64 transition-all w-full">
        <AdminHeader />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
