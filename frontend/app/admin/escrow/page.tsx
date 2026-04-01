"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock, ShieldCheck, Wallet, User, Store, ExternalLink, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { adminOrdersApi } from "@/lib/api";
import type { OrderResponse } from "@/types";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export default function AdminEscrowPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingOrder, setPayingOrder] = useState<OrderResponse | null>(null);

  async function loadOrders() {
    try {
      setLoading(true);
      const res = await adminOrdersApi.getAll();
      if (res.success) {
        setOrders(res.data.filter(o => 
          o.status === 'SHIPPING' || 
          o.status === 'DELIVERED' || 
          o.status === 'ESCROW_HOLDING' || 
          o.status === 'COMPLETED'
        ));
      }
    } catch (err: any) {
      toast.error(err.message || "Không thể tải danh sách giam tiền.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const handleReleaseEscrow = async (id: number) => {
    try {
      const res = await adminOrdersApi.releaseEscrow(id);
      if (res.success) {
        toast.success("Giải ngân thành công! Đơn hàng đã hoàn tất.");
        setOrders(prev => prev.map(o => o.id === id ? res.data : o));
        setPayingOrder(null);
      }
    } catch (err: any) {
      toast.error(err.message || "Giải ngân thất bại!");
    }
  };

  const handleConfirmOrder = async (id: number) => {
    if (!confirm("Xác nhận đơn hàng này đã giao hàng thành công và bắt đầu quy trình GIAM TIỀN 3 ngày?")) return;
    try {
      const res = await adminOrdersApi.updateStatus(id, "ESCROW_HOLDING");
      if (res.success) {
        toast.success("Xác nhận thành công! Tiền đã chuyển vào trạng thái GIAM.");
        setOrders(prev => prev.map(o => o.id === id ? res.data : o));
      }
    } catch (err: any) {
      toast.error(err.message || "Xác nhận thất bại!");
    }
  };

  const isReadyToRelease = (holdAt?: string) => {
    if (!holdAt) return false;
    const end = new Date(new Date(holdAt).getTime() + 3 * 24 * 60 * 60 * 1000);
    return new Date() >= end;
  };

  const getEscrowTimeRemaining = (holdAt: string) => {
    const end = new Date(new Date(holdAt).getTime() + 3 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return "Sẵn sàng";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b pb-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900">Quản lý Giam tiền (Escrow)</h1>
           <p className="text-slate-500">Tạm giữ tiền sàn trong 3 ngày để bảo vệ quyền lợi Người mua.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-purple-50 border border-purple-100 p-3 rounded-lg flex items-center gap-3">
              <div className="bg-purple-500 p-2 rounded-lg text-white">
                 <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                 <p className="text-[10px] uppercase font-bold text-purple-600">Đang giam</p>
                 <p className="text-xl font-bold text-purple-900">
                   {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                     orders.filter(o => o.status === 'ESCROW_HOLDING').reduce((sum, o) => sum + (o.totalAmount - o.depositAmount), 0)
                   )}
                 </p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="p-20 text-center text-slate-400">Đang truy xuất ví sàn...</div>
        ) : (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
             <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase text-[10px]">
                   <tr>
                      <th className="px-6 py-4">Đơn hàng / Ngày giam</th>
                      <th className="px-6 py-4">Người mua</th>
                      <th className="px-6 py-4">Cửa hàng (Người bán)</th>
                      <th className="px-6 py-4 text-right">Số tiền còn lại</th>
                      <th className="px-6 py-4 text-center">Thời gian</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                   </tr>
                </thead>
                <tbody className="divide-y text-slate-600">
                   {orders.map(order => (
                     <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                           <p className="font-bold text-slate-900">#{order.id}</p>
                           <p className="text-[10px] text-slate-400 italic">
                             {order.escrowHoldAt ? new Date(order.escrowHoldAt).toLocaleString('vi-VN') : '---'}
                           </p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="flex items-center gap-1.5 font-medium"><User className="h-3 w-3" /> User #{order.userId}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="flex items-center gap-1.5 font-bold text-slate-800"><Store className="h-3.5 w-3.5 text-primary" /> {order.shopName}</p>
                           <p className="text-[10px] text-slate-400 mt-0.5">{order.sellerName || 'Owner'}</p>
                        </td>
                        <td className="px-6 py-4 text-right font-extrabold text-slate-900">
                           {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount - (order.depositAmount || 0))}
                        </td>
                        <td className="px-6 py-4 text-center">
                           {order.status === 'ESCROW_HOLDING' ? (
                             <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold ${isReadyToRelease(order.escrowHoldAt?.toString()) ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                <Clock className="h-3 w-3" /> {order.escrowHoldAt ? getEscrowTimeRemaining(order.escrowHoldAt.toString()) : '---'}
                             </span>
                           ) : order.status === 'SHIPPING' || order.status === 'DELIVERED' ? (
                             <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold ring-1 ring-blue-600/20">
                                <Clock className="h-3 w-3" /> Đang/Đã giao
                             </span>
                           ) : (
                             <span className="text-emerald-500 font-bold text-xs flex items-center justify-center gap-1"><CheckCircle className="h-3 w-3" /> Đã hoàn tất</span>
                           )}
                        </td>
                        <td className="px-6 py-4 text-right">
                           {(order.status === 'SHIPPING' || order.status === 'DELIVERED') && (
                             <Button 
                               size="sm" 
                               onClick={() => handleConfirmOrder(order.id)}
                               className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 text-xs"
                             >
                               XÁC NHẬN (DONE)
                             </Button>
                           )}
                           {order.status === 'ESCROW_HOLDING' && (
                             <Button 
                               size="sm" 
                               onClick={() => setPayingOrder(order)}
                               className="bg-primary hover:bg-primary/90 text-white font-bold h-8 text-xs"
                             >
                               THANH TOÁN
                             </Button>
                           )}
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </div>

      {/* Payment Modal for Admin to pay Seller */}
      {payingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in zoom-in duration-200">
           <Card className="max-w-xl w-full border-none shadow-2xl overflow-hidden ring-1 ring-white/10">
              <CardHeader className="bg-slate-900 text-white border-none py-6">
                 <div className="flex justify-between items-center">
                    <div>
                       <CardTitle className="text-xl flex items-center gap-2">
                          <Wallet className="h-5 w-5 text-emerald-400" /> QUYẾT TOÁN CHO NGƯỜI BÁN
                       </CardTitle>
                       <p className="text-slate-400 text-xs mt-1">Đơn hàng #{payingOrder.id} - {payingOrder.shopName}</p>
                    </div>
                    <button onClick={() => setPayingOrder(null)} className="text-slate-400 hover:text-white transition-colors">✕</button>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="p-8 space-y-6">
                    {!payingOrder.sellerBankAccount ? (
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800">
                         <AlertTriangle className="h-5 w-5 shrink-0" />
                         <p className="text-sm font-medium">Người bán chưa cập nhật thông tin ngân hàng trong hồ sơ. Vui lòng liên hệ người bán để quyết toán.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-50 p-6 rounded-2xl border border-slate-200">
                         <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                            <img 
                              src={`https://img.vietqr.io/image/${payingOrder.sellerBankName || 'ICB'}-${payingOrder.sellerBankAccount || '0000'}-compact2.png?amount=${payingOrder.totalAmount - (payingOrder.depositAmount || 0)}&addInfo=Thanh_Toan_Sàn_Don_${payingOrder.id}&accountName=${payingOrder.sellerName}`}
                              alt="Seller QR"
                              className="w-40 h-40"
                            />
                         </div>
                         <div className="flex-1 space-y-3">
                            <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Người thụ hưởng</p>
                               <p className="font-bold text-slate-900 text-lg">{payingOrder.sellerName}</p>
                               <p className="text-xs text-slate-500">{payingOrder.sellerBankName} - {payingOrder.sellerBankAccount}</p>
                            </div>
                            <div>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Số tiền giải ngân</p>
                               <p className="font-extrabold text-emerald-600 text-2xl">
                                 {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payingOrder.totalAmount - (payingOrder.depositAmount || 0))}
                               </p>
                               <p className="text-[9px] text-slate-400 mt-1 italic">(Sàn đã thu cọc 20% trước đó)</p>
                            </div>
                         </div>
                      </div>
                    )}

                    <div className="space-y-3 pt-4">
                       <p className="text-xs text-slate-500 leading-relaxed">
                         <b>Hướng dẫn:</b> Quét mã QR trên để chuyển khoản cho người bán. Sau khi chuyển thành công, nhấn nút xác nhận bên dưới để hoàn tất đơn hàng và giải phóng trạng thái giam tiền.
                       </p>
                       <div className="flex gap-3">
                          <Button 
                            variant="destructive" 
                            className="flex-1 font-bold h-12"
                            onClick={() => setPayingOrder(null)}
                          >
                             ĐỂ SAU
                          </Button>
                          <Button 
                            className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 shadow-lg shadow-emerald-200"
                            disabled={!payingOrder.sellerBankAccount}
                            onClick={() => handleReleaseEscrow(payingOrder.id)}
                          >
                             XÁC NHẬN ĐÃ THANH TOÁN
                          </Button>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      )}
    </div>
  );
}
