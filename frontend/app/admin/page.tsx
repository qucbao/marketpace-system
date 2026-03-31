"use client";

import { useEffect, useState } from "react";
import { CopyPlus, Store, Users, ShoppingBag, Receipt, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { adminDashboardApi, type DashboardStats } from "@/lib/api/admin-dashboard";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadStats() {
    try {
      setLoading(true);
      const res = await adminDashboardApi.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Không thể tải thống kê");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);
  
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
        <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md group">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-bold tracking-tight text-slate-600 uppercase">Doanh thu tạm tính</h3>
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
               <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
             {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats?.totalRevenue || 0)}
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-medium">
            Phí 20% từ các đơn cọc
          </p>
        </div>
        
        <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md group">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-bold tracking-tight text-slate-600 uppercase">Cửa hàng chờ duyệt</h3>
            <div className="bg-orange-100 p-2 rounded-lg text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
               <Store className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{stats?.pendingShops || 0}</div>
          <p className="text-xs text-orange-600 mt-2 font-bold flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Cần rà soát sớm
          </p>
        </div>
        
        <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md group">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-bold tracking-tight text-slate-600 uppercase">Người dùng hệ thống</h3>
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
               <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{stats?.totalUsers || 0}</div>
          <p className="text-xs text-muted-foreground mt-2 font-medium uppercase tracking-tighter">
            Tài khoản đã đăng ký
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md group">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-bold tracking-tight text-slate-600 uppercase">Tổng Vận đơn</h3>
            <div className="bg-violet-100 p-2 rounded-lg text-violet-600 group-hover:bg-violet-500 group-hover:text-white transition-colors">
               <Receipt className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{stats?.totalOrders || 0}</div>
          <p className="text-xs text-muted-foreground mt-2 font-medium tracking-tighter italic">
            {stats?.totalProducts || 0} Sản phẩm có sẵn
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2 mt-8">
        <div className="rounded-xl border bg-white shadow-sm p-8 relative min-h-[400px] flex flex-col justify-center items-center">
           <div className="bg-primary/5 p-4 rounded-full mb-4">
              <ShoppingBag className="h-8 w-8 text-primary opacity-20" />
           </div>
           <h2 className="text-xl font-bold text-slate-800">Bản đồ sản phẩm</h2>
           <p className="text-sm text-slate-400 mt-1">Đang thu thập dữ liệu heatmap...</p>
        </div>
        
        <div className="rounded-xl border bg-white shadow-sm p-8 relative min-h-[400px] flex flex-col justify-center items-center">
           <div className="bg-violet-50 p-4 rounded-full mb-4">
              <TrendingUp className="h-8 w-8 text-violet-400 opacity-20" />
           </div>
           <h2 className="text-xl font-bold text-slate-800">Tăng trưởng người dùng</h2>
           <p className="text-sm text-slate-400 mt-1">Dữ liệu log đang được xử lý</p>
        </div>
      </div>
    </div>
  );
}
