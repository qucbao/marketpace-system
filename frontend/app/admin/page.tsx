"use client";

import { useAuth } from "@/hooks/use-auth";
import { CopyPlus, Store, Users, ShoppingBag } from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 border-b pb-4">
          Tổng quan Bảng điều khiển
        </h1>
        <p className="text-muted-foreground">
          Chào mừng <span className="font-semibold text-primary">{user?.fullName}</span> quay trở lại quản trị hệ thống.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 pt-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Doanh thu tạm tính</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-emerald-500"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="text-2xl font-bold">0 ₫</div>
          <p className="text-xs text-muted-foreground mt-1 text-emerald-600">
            +0% so với tháng trước
          </p>
        </div>
        
        <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Cửa hàng chờ duyệt</h3>
            <Store className="h-4 w-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold">1</div>
          <p className="text-xs text-muted-foreground mt-1 text-orange-600">
            Cần rà soát sớm
          </p>
        </div>
        
        <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Người dùng mới</h3>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold">+0</div>
          <p className="text-xs text-muted-foreground mt-1 text-slate-500">
            Số lượt đăng ký 7 ngày qua
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Tổng Lượt Giao Dịch</h3>
            <CopyPlus className="h-4 w-4 text-violet-500" />
          </div>
          <div className="text-2xl font-bold">+0</div>
          <p className="text-xs text-muted-foreground mt-1 text-slate-500">
            Số order trung bình: 0 / ngày
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2 mt-8">
        <div className="rounded-xl border bg-white shadow-sm p-6 relative min-h-[300px]">
          <h2 className="text-lg font-semibold tracking-tight">Lịch sử Duyệt Shop Gần Đây</h2>
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <p className="text-sm text-muted-foreground">Chưa có dữ liệu đồ thị nào được ghi lại</p>
          </div>
        </div>
        
        <div className="rounded-xl border bg-white shadow-sm p-6 relative min-h-[300px]">
          <h2 className="text-lg font-semibold tracking-tight">Hành động mới nhất (Log)</h2>
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <p className="text-sm text-muted-foreground">Log truy cập rỗng</p>
          </div>
        </div>
      </div>
    </div>
  );
}
