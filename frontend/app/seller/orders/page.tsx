"use client";

import { useEffect, useState } from "react";
import { Receipt, CheckCircle, XCircle, Clock, Package } from "lucide-react";
import { toast } from "sonner";

import { sellerOrdersApi } from "@/lib/api/seller-orders";
import type { OrderResponse } from "@/types";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    try {
      setLoading(true);
      const res = await sellerOrdersApi.getAll();
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Không thể tải đơn hàng.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    const confirmMsg = status === "COMPLETED" 
      ? "Bạn xác nhận đơn hàng này đã hoàn tất giao dịch?" 
      : "Bạn chắc chắn muốn HỦY đơn hàng này? Tồn kho sẽ được cộng lại.";
    
    if (confirm(confirmMsg)) {
      try {
        const res = await sellerOrdersApi.updateStatus(id, status);
        if (res.success) {
          toast.success("Cập nhật trạng thái thành công!");
          // Reload local list
          setOrders(prev => prev.map(o => o.id === id ? res.data : o));
        }
      } catch (err: any) {
        toast.error(err.message || "Cập nhật thất bại!");
      }
    }
  };

  const getStatusBadge = (order: OrderResponse) => {
    switch (order.status) {
      case "PENDING":
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-600/20"><Clock className="h-3 w-3" /> Chờ cọc</span>;
      case "DEPOSIT_SUBMITTED":
        return <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-600/20"><Clock className="h-3 w-3" /> Chờ duyệt bill</span>;
      case "PAID_DEPOSIT":
        return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-600/20"><CheckCircle className="h-3 w-3" /> Đã cọc / Sẵn sàng</span>;
      case "PREPARING":
        return <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-600/20"><Package className="h-3 w-3" /> Đang chuẩn bị</span>;
      case "SHIPPING":
        return <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-1 text-xs font-bold text-sky-700 ring-1 ring-sky-600/20"><Clock className="h-3 w-3" /> Đang giao hàng</span>;
      case "DELIVERED":
        return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-600/20"><CheckCircle className="h-3 w-3" /> Đã giao xong</span>;
      case "ESCROW_HOLDING":
        return <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-1 text-xs font-bold text-purple-700 ring-1 ring-purple-600/20"><Clock className="h-3 w-3" /> Đang giam tiền</span>;
      case "COMPLETED":
        return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-600/20"><CheckCircle className="h-3 w-3" /> Hoàn tất</span>;
      case "CANCELLED":
        return <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-700 ring-1 ring-red-600/20"><XCircle className="h-3 w-3" /> Đã hủy</span>;
      default:
        return order.status;
    }
  };

  const getEscrowTimeRemaining = (holdAt: string) => {
    const end = new Date(new Date(holdAt).getTime() + 3 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return "Sẵn sàng thanh toán";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days} ngày ${hours} giờ`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quản lý Đơn hàng</h1>
        <p className="text-muted-foreground">Theo dõi tiến độ Escrow và cập nhật vận đơn cho khách.</p>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-12 text-center text-muted-foreground mt-8">
            <div className="animate-spin h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            Đang truy xuất vận đơn...
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground min-h-[300px]">
            <Receipt className="h-12 w-12 text-muted-foreground/20 mb-4" />
            <p className="font-medium text-lg">Chưa có đơn hàng nào</p>
            <p className="text-sm mt-1">Đơn hàng mới từ khách sẽ xuất hiện tại đây.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b">
                <tr>
                  <th className="px-6 py-4">Mã đơn / Ngày</th>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Sản phẩm</th>
                  <th className="px-6 py-4 text-center">Trạng thái</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 bg-white group transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">#{order.id}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 uppercase">{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                    </td>
                    <td className="px-6 py-4">
                       <p className="font-medium text-slate-700 underline underline-offset-2">User #{order.userId}</p>
                       <p className="text-[10px] text-muted-foreground mt-1">
                         {order.checkoutType === 'DELIVERY' ? '☎ Ship tận nơi' : '🏠 Nhận tại shop'}
                       </p>
                    </td>
                    <td className="px-6 py-4 max-w-[200px]">
                       {order.items.map((item, idx) => (
                         <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                            <Package className="h-3 w-3 text-slate-400" />
                            <span className="truncate">{item.productName}</span>
                            <span className="font-bold text-slate-400">x{item.quantity}</span>
                         </div>
                       ))}
                       <p className="font-bold text-slate-800 mt-2">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                       {getStatusBadge(order)}
                       {order.status === 'ESCROW_HOLDING' && order.escrowHoldAt && (
                         <p className="text-[10px] text-purple-600 mt-1 font-bold">
                           Còn: {getEscrowTimeRemaining(order.escrowHoldAt)}
                         </p>
                       )}
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col gap-2 items-center">
                          {order.status === "PAID_DEPOSIT" && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, "PREPARING")}
                              className="w-full max-w-[120px] px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold shadow-sm transition-all"
                            >
                              Chuẩn bị hàng
                            </button>
                          )}
                          {order.status === "PREPARING" && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, "SHIPPING")}
                              className="w-full max-w-[120px] px-3 py-1.5 rounded-md bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold shadow-sm transition-all"
                            >
                              Bắt đầu giao
                            </button>
                          )}
                          {order.status === "PENDING" && (
                            <span className="text-[10px] text-slate-400 italic">Chờ cọc</span>
                          )}
                          
                          {(order.status === "PENDING" || order.status === "DEPOSIT_SUBMITTED") && (
                             <span className="text-[10px] text-slate-400 italic">Chờ người mua/Admin xử lý cọc</span>
                          )}

                          {order.status === "ESCROW_HOLDING" && (
                             <p className="text-[10px] text-purple-600 italic font-medium px-2 py-1 bg-purple-50 rounded border border-purple-100">Tiền đang được sàn giam 🔐</p>
                          )}

                          {order.status === "COMPLETED" && (
                             <span className="text-xs text-emerald-600 italic font-medium">Giao dịch thành công ✓</span>
                          )}
                          {order.status === "CANCELLED" && (
                             <span className="text-xs text-slate-400 line-through">Đơn hàng đã hủy</span>
                          )}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
