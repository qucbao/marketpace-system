"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Clock, Eye, Receipt, User, Store, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { adminOrdersApi, filesApi } from "@/lib/api";
import type { OrderResponse } from "@/types";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState<string | null>(null);
  const [settlementOrder, setSettlementOrder] = useState<OrderResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"deposits" | "all">("deposits");

  async function loadOrders() {
    try {
      setLoading(true);
      const res = await adminOrdersApi.getAll();
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Không thể tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    const confirmMsg = status === "DELIVERED" ? "Xác nhận đơn hàng này đã được giao thành công?" : `Chuyển đơn hàng sang ${status}?`;
    if (!confirm(confirmMsg)) return;

    try {
      const res = await adminOrdersApi.updateStatus(id, status);
      if (res.success) {
        toast.success("Cập nhật trạng thái thành công!");
        setOrders(prev => prev.map(o => o.id === id ? res.data : o));
      }
    } catch (err: any) {
      toast.error(err.message || "Thất bại!");
    }
  };

  const handleApproveDeposit = async (id: number) => {
    if (!confirm("Xác nhận đã nhận được tiền cọc 20% cho đơn hàng này?")) return;
    try {
      const res = await adminOrdersApi.approveDeposit(id);
      if (res.success) {
        toast.success("Duyệt cọc thành công! Người bán có thể bắt đầu chuẩn bị hàng.");
        setOrders(prev => prev.map(o => o.id === id ? res.data : o));
      }
    } catch (err: any) {
      toast.error(err.message || "Duyệt cọc thất bại!");
    }
  };

  const handleConfirmSettle = async () => {
    if (!settlementOrder) return;
    try {
      const res = await adminOrdersApi.releaseEscrow(settlementOrder.id);
      if (res.success) {
        toast.success("Giải ngân thành công! Giao dịch đã hoàn tất.");
        setOrders(prev => prev.map(o => o.id === settlementOrder.id ? res.data : o));
        setSettlementOrder(null);
      }
    } catch (err: any) {
      toast.error(err.message || "Giải ngân thất bại!");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-bold">CHỜ CỌC</span>;
      case "DEPOSIT_SUBMITTED": return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold animate-pulse">CHỜ DUYỆT BILL</span>;
      case "PAID_DEPOSIT": return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold">ĐÃ CỌC / CHUẨN BỊ</span>;
      case "PREPARING": return <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-[10px] font-bold">SẮP GIAO</span>;
      case "SHIPPING": return <span className="bg-sky-100 text-sky-700 px-2 py-1 rounded text-[10px] font-bold">ĐANG SHIP</span>;
      case "DELIVERED": return <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded text-[10px] font-bold">ĐÃ GIAO</span>;
      case "ESCROW_HOLDING": return <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-[10px] font-bold">GIỮ TIỀN (ESCROW)</span>;
      case "COMPLETED": return <span className="bg-emerald-500 text-white px-2 py-1 rounded text-[10px] font-bold">HOÀN TẤT</span>;
      case "CANCELLED": return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold">ĐÃ HỦY</span>;
      default: return <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded text-[10px] font-bold">{status}</span>;
    }
  };

  const depositOrders = orders.filter(o => o.checkoutType === 'DELIVERY' && (o.status === 'DEPOSIT_SUBMITTED' || o.status === 'PENDING' || o.status === 'PAID_DEPOSIT'));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b pb-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900">Quản trị đơn hàng</h1>
           <p className="text-slate-500">Giám sát toàn bộ giao dịch và xử lý giải ngân ký quỹ.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg text-white">
                 <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                 <p className="text-[10px] uppercase font-bold text-blue-600">Đang giữ tiền</p>
                 <p className="text-xl font-bold text-blue-900">{orders.filter(o => o.status === 'ESCROW_HOLDING').length}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
         <button 
           onClick={() => setActiveTab("deposits")}
           className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'deposits' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}
         >
           Giao dịch cọc
         </button>
         <button 
           onClick={() => setActiveTab("all")}
           className={`px-6 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'all' ? 'bg-white shadow text-primary' : 'text-slate-500 hover:text-slate-700'}`}
         >
           Tất cả đơn hàng
         </button>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="p-20 text-center text-slate-400 font-bold">Đang tải vận đơn...</div>
        ) : (activeTab === 'deposits' ? depositOrders : orders).length === 0 ? (
          <Card className="p-20 text-center text-slate-400 font-bold italic">Không có đơn hàng nào trong mục này.</Card>
        ) : (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
             <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b text-slate-500 font-bold uppercase text-[10px]">
                   <tr>
                      <th className="px-6 py-4">Đơn hàng / Ngày</th>
                      <th className="px-6 py-4">Khách mua / Cửa hàng</th>
                      <th className="px-6 py-4 text-right">Tổng tiền / Cọc</th>
                      <th className="px-6 py-4 text-center">Bằng chứng</th>
                      <th className="px-6 py-4 text-center">Trạng thái</th>
                      <th className="px-6 py-4 text-right">Thao tác</th>
                   </tr>
                </thead>
                <tbody className="divide-y">
                   {(activeTab === 'deposits' ? depositOrders : orders).map(order => (
                     <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <p className="font-bold text-slate-900">#{order.id}</p>
                           <p className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-bold text-slate-700 line-clamp-1">{order.buyerName || `User #${order.userId}`}</p>
                           <p className="text-[10px] text-primary flex items-center gap-1 font-bold">
                              <Store className="h-3 w-3" /> {order.shopName}
                           </p>
                        </td>
                        <td className="px-6 py-4 text-right font-medium">
                           <p className="font-black text-slate-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</p>
                           <p className="text-[10px] text-amber-600 font-bold tracking-tighter">Cọc: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.depositAmount)}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                           {order.depositBillUrl ? (
                             <button 
                               onClick={() => setSelectedBill(order.depositBillUrl!)}
                               className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold text-xs bg-blue-50 px-2 py-1 rounded"
                             >
                                <Eye className="h-3 w-3" /> Xem Bill
                             </button>
                           ) : (
                             <span className="text-slate-300 italic text-[10px]">Trống</span>
                           )}
                        </td>
                        <td className="px-6 py-4 text-center">{getStatusBadge(order.status)}</td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-2">
                              {order.status === 'DEPOSIT_SUBMITTED' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleApproveDeposit(order.id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 px-3 text-xs"
                                >
                                  DUYỆT CỌC
                                </Button>
                              )}

                              {order.status === 'SHIPPING' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleUpdateStatus(order.id, "DELIVERED")}
                                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold h-8 px-3 text-xs"
                                >
                                  ĐÃ GIAO
                                </Button>
                              )}
                              
                              {order.status === 'ESCROW_HOLDING' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSettlementOrder(order)}
                                  className="border-primary text-primary hover:bg-primary/5 font-bold h-8 px-3 text-xs"
                                >
                                  GIẢI NGÂN
                                </Button>
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

      {/* Bill Preview Modal */}
      {selectedBill && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-200">
           <Card className="max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border-0 shadow-2xl">
              <CardHeader className="border-b bg-white flex flex-row items-center justify-between py-4">
                 <CardTitle className="text-lg font-black tracking-tight">Bằng chứng chuyển khoản</CardTitle>
                 <button onClick={() => setSelectedBill(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">✕</button>
              </CardHeader>
              <CardContent className="p-4 overflow-auto bg-slate-900 flex justify-center grayscale-[0.2] hover:grayscale-0 transition-all">
                 <img 
                   src={filesApi.getDownloadUrl(selectedBill)} 
                   alt="Bill" 
                   className="max-w-full rounded shadow-2xl border border-white/10"
                 />
              </CardContent>
           </Card>
        </div>
      )}

      {/* Settlement Modal (QR Quyết toán) */}
      {settlementOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
           <div className="max-w-xl w-full bg-slate-900 text-white rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden">
              <div className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                       <Receipt className="h-5 w-5" />
                    </div>
                    <div>
                       <h2 className="text-xl font-black tracking-tight">QUYẾT TOÁN CHO NGƯỜI BÁN</h2>
                       <p className="text-xs text-slate-400 font-medium italic">Đơn #{settlementOrder.id} - shop {settlementOrder.shopName}</p>
                    </div>
                 </div>
                 <button onClick={() => setSettlementOrder(null)} className="h-10 w-10 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors">✕</button>
              </div>

              <div className="p-8">
                 <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex gap-6 items-center">
                    <div className="bg-white p-2 rounded-2xl h-44 w-44 flex items-center justify-center shadow-xl">
                       <img 
                         src={`https://img.vietqr.io/image/${(settlementOrder.sellerBankName || 'MB').toUpperCase().replace(/ BANK/g, '').replace(/ NGÂN HÀNG/g, '').trim().split(' ')[0]}-${settlementOrder.sellerBankAccount || '999999999'}-compact.png?amount=${settlementOrder.totalAmount}&addInfo=Quyet toan don hang ${settlementOrder.id}`} 
                         alt="Seller QR" 
                         className="h-full w-full object-contain"
                       />
                    </div>
                    <div className="flex-1 space-y-4">
                       <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Người thụ hưởng</p>
                          <p className="text-lg font-black">{settlementOrder.sellerName || "Chủ shop"}</p>
                          <p className="text-xs text-slate-400">{settlementOrder.sellerBankName} - {settlementOrder.sellerBankAccount}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Số tiền giải ngân</p>
                          <p className="text-3xl font-black text-emerald-400 flex items-baseline gap-1">
                             {new Intl.NumberFormat('vi-VN').format(settlementOrder.totalAmount)}
                             <span className="text-sm underline">đ</span>
                          </p>
                          <p className="text-[10px] text-slate-500 italic mt-1">(Sàn đã thu cọc 20% trước đó)</p>
                       </div>
                    </div>
                 </div>

                 <div className="mt-8 space-y-4">
                    <p className="text-xs text-slate-400 leading-relaxed">
                       <b>Hướng dẫn:</b> Quét mã QR trên để chuyển khoản cho người bán. Sau khi chuyển thành công, nhấn nút xác nhận bên dưới để hoàn tất đơn hàng và giải phóng trạng thái giam tiền.
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                       <button 
                         onClick={() => setSettlementOrder(null)}
                         className="h-14 rounded-2xl bg-rose-500/10 text-rose-500 font-bold hover:bg-rose-500/20 transition-all"
                       >
                         ĐỂ SAU
                       </button>
                       <button 
                         onClick={handleConfirmSettle}
                         className="h-14 rounded-2xl bg-emerald-500 text-slate-900 font-black hover:bg-emerald-400 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20"
                       >
                         XÁC NHẬN ĐÃ THANH TOÁN
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
