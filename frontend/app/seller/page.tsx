"use client";

import { useAuth } from "@/hooks/use-auth";
import { Package, Receipt, AlertCircle, HandCoins, Store } from "lucide-react";
import Link from "next/link";

export default function SellerDashboardPage() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 border-none">
          Tổng quan Kênh Người Bán
        </h1>
        <p className="text-muted-foreground">
          Xin chào chủ gian hàng <span className="font-semibold text-orange-600">{user?.fullName}</span>. Hôm nay shop bạn bán được bao nhiêu đơn?
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 pt-4">
        <div className="rounded-xl border border-orange-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-orange-200">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Doanh thu tạm tính</h3>
            <HandCoins className="h-4 w-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800">0 ₫</div>
          <p className="text-xs text-muted-foreground mt-1 text-orange-600">
            Tổng thu (chưa trừ thuế)
          </p>
        </div>
        
        <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Đơn hàng mới</h3>
            <Receipt className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground mt-1 text-slate-500">
            Chờ xử lý / Đóng gói
          </p>
        </div>
        
        <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md border-red-100 bg-red-50/20">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight text-red-800">Cảnh báo Tồn Kho</h3>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600">0</div>
          <p className="text-xs text-red-500/80 mt-1">
            Sản phẩm sắp hết hàng
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium tracking-tight">Đang rảnh tay?</h3>
            <Package className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold mt-1 text-slate-800 flex items-center h-8">
            <Link href="/seller/products/new" className="text-sm text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
               + Đăng bán sản phẩm mới
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2 mt-8">
        <div className="rounded-xl border bg-white shadow-sm p-6 relative min-h-[300px]">
          <h2 className="text-lg font-semibold tracking-tight">Việc Cần Làm</h2>
          <div className="mt-6 flex flex-col gap-4">
             <div className="flex justify-between items-center py-3 border-b border-dashed">
                <span className="text-sm text-muted-foreground">Chờ xác nhận</span>
                <span className="text-lg font-bold text-blue-600">0</span>
             </div>
             <div className="flex justify-between items-center py-3 border-b border-dashed">
                <span className="text-sm text-muted-foreground">Chờ lấy hàng</span>
                <span className="text-lg font-bold text-orange-600">0</span>
             </div>
             <div className="flex justify-between items-center py-3 border-b border-dashed">
                <span className="text-sm text-muted-foreground">Đã xử lý / Đang giao</span>
                <span className="text-lg font-bold text-emerald-600">0</span>
             </div>
             <div className="flex justify-between items-center py-3">
                <span className="text-sm text-muted-foreground">Trả hàng / Hoàn tiền</span>
                <span className="text-lg font-bold text-red-600">0</span>
             </div>
          </div>
        </div>
        
        <div className="rounded-xl border bg-white shadow-sm p-6 relative min-h-[300px]">
          <h2 className="text-lg font-semibold tracking-tight mb-2">Thông báo từ sàn</h2>
          <div className="absolute inset-0 top-12 flex flex-col items-center justify-center p-6 text-center">
             <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                <Store className="h-6 w-6 text-orange-500" />
             </div>
             <p className="font-medium text-slate-800">Cửa hàng đã kích hoạt thành công!</p>
             <p className="text-sm text-muted-foreground mt-1 max-w-sm">Chúc mừng bạn đã chính thức được phê duyệt thành Đối Tác / Kênh Người Bán của hệ thống.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
