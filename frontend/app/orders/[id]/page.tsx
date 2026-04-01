"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, Clock, Upload, Loader2, ExternalLink, Receipt } from "lucide-react";
import { toast } from "sonner";

import { OrderStatusBadge } from "@/components/order/order-status-badge";
import {
  AppShell,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorState,
  LoadingState,
  PageContainer,
  SectionHeader,
} from "@/components/ui";
import { useOrderDetail } from "@/hooks/use-order-detail";
import { ordersApi, usersApi, filesApi } from "@/lib/api";
import type { UserProfileResponse } from "@/lib/api/users";

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const orderId = rawId ? Number(rawId) : null;
  const { order, loading, errorMessage, refreshOrder } = useOrderDetail(orderId);

  const [adminBank, setAdminBank] = useState<UserProfileResponse | null>(null);
  const [uploading, setUploading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (order?.status === "PENDING" && order.checkoutType === "DELIVERY") {
      usersApi.getAdminBank().then(res => {
        if (res.success) setAdminBank(res.data);
      });
    }
  }, [order?.status, order?.checkoutType]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  async function handleSubmitBill() {
    if (!selectedFile || !orderId) return;

    try {
      setUploading(true);
      const uploadRes = await filesApi.upload(selectedFile);
      if (uploadRes.success) {
        await ordersApi.submitBill(orderId, uploadRes.data);
        toast.success("Đã nộp hóa đơn! Đang chờ Admin xác nhận.");
        setSelectedFile(null);
        setPreviewUrl(null);
        refreshOrder();
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi nộp hóa đơn.");
    } finally {
      setUploading(false);
    }
  }

  async function handleConfirmDelivery() {
    if (!orderId) return;
    try {
      setActionLoading(true);
      await ordersApi.confirmDelivery(orderId);
      toast.success("Xác nhận thành công! Tiền đã được giam trong 3 ngày.");
      refreshOrder();
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi xác nhận đơn hàng");
    } finally {
      setActionLoading(false);
    }
  }

  function getBankCode(name?: string) {
    if (!name) return "ICB"; 
    const n = name.toUpperCase();
    if (n.includes("VIETCOM")) return "VCB";
    if (n.includes("VIETIN")) return "CTG";
    if (n.includes("BIDV")) return "BIDV";
    if (n.includes("AGRI")) return "VBA";
    if (n.includes("TECHCOM")) return "TCB";
    if (n.includes("MB")) return "MB";
    if (n.includes("ACB")) return "ACB";
    if (n.includes("VP")) return "VPB";
    if (n.includes("VIB")) return "VIB";
    if (n.includes("SHB")) return "SHB";
    return name; // Trả về nguyên bản nếu không khớp
  }

  return (
    <AppShell>
      <PageContainer className="px-0 lg:px-0">
        <SectionHeader
          eyebrow="Orders"
          title={order ? `Đơn hàng #${order.id}` : `Chi tiết đơn hàng #${rawId ?? ""}`}
          description="Xem chi tiết trạng thái, thanh toán và các mặt hàng đã mua."
          action={order ? <OrderStatusBadge status={order.status} /> : null}
        />

        {loading ? (
          <LoadingState
            title="Đang tải chi tiết đơn hàng"
            description="Vui lòng chờ trong giây lát."
            className="mt-10"
          />
        ) : null}

        {!loading && errorMessage ? (
          <ErrorState
            title="Không thể tải chi tiết đơn hàng"
            description={errorMessage}
            className="mt-10"
          />
        ) : null}

        {!loading && !errorMessage && !order ? (
          <EmptyState
            title="Không tìm thấy đơn hàng"
            description="Đơn hàng này không tồn tại hoặc bạn không có quyền truy cập."
            className="mt-10"
          />
        ) : null}

        {!loading && order ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
            <div className="space-y-6">
              {/* Payment Section for Buyer */}
              {order.status === "PENDING" && order.checkoutType === "DELIVERY" && (
                <Card className="border-amber-200 bg-amber-50 overflow-hidden ring-1 ring-amber-100 shadow-sm transition-all">
                  <CardHeader className="bg-amber-100/50 py-3 border-b border-amber-200">
                    <CardTitle className="text-sm font-bold text-amber-800 uppercase flex items-center gap-2">
                      <Clock className="h-4 w-4" /> QUY TRÌNH ĐẶT CỌC 20%
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                     <div className="grid md:grid-cols-[200px_1fr] gap-8 items-start">
                        <div className="space-y-3">
                           {adminBank?.bankAccount ? (
                             <div className="bg-white p-3 rounded-2xl shadow-md ring-1 ring-slate-100 hover:scale-[1.02] transition-transform">
                               <img 
                                 src={`https://img.vietqr.io/image/${getBankCode(adminBank.bankName)}-${adminBank.bankAccount}-compact2.png?amount=${order.depositAmount}&addInfo=Coc_Don_${order.id}&accountName=${adminBank.fullName}`}
                                 alt="VietQR Admin"
                                 className="w-full aspect-square"
                               />
                               <p className="text-[9px] text-center text-slate-400 mt-2 font-medium italic">Quét để chuyển nhanh</p>
                             </div>
                           ) : (
                             <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 p-4 text-center">
                                <span className="text-xs text-slate-400 font-bold text-red-400">Admin chưa cài đặt thông tin ngân hàng trong hồ sơ</span>
                                <p className="text-[10px] text-slate-400 mt-1">Vui lòng liên hệ Admin để chuyển khoản trực tiếp</p>
                             </div>
                           )}
                        </div>
                        
                        <div className="space-y-5">
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm">
                                 <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Số tiền cọc (20%)</p>
                                 <p className="font-black text-amber-600 text-xl tracking-tighter">{formatPrice(order.depositAmount)}</p>
                              </div>
                              <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm">
                                 <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Cần thụ hưởng</p>
                                 <p className="font-bold text-slate-900 text-sm truncate">{adminBank?.fullName || 'Sàn Marketplace'}</p>
                                 <p className="text-[10px] text-slate-500">{adminBank?.bankName || '---'} : {adminBank?.bankAccount || '---'}</p>
                              </div>
                           </div>

                           <div className="space-y-3">
                              <div className="flex gap-4">
                                 <label className="flex-1 flex flex-col items-center justify-center h-20 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-white hover:bg-slate-50 transition-colors">
                                    <div className="flex flex-col items-center">
                                       <Upload className="h-4 w-4 text-slate-400 mb-1" />
                                       <span className="text-[11px] font-bold text-slate-600">{previewUrl ? "Thay đổi ảnh Bill" : "Chọn ảnh hóa đơn"}</span>
                                    </div>
                                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                 </label>
                                 {previewUrl && (
                                   <div className="h-20 w-20 rounded-xl overflow-hidden border border-emerald-500 ring-2 ring-emerald-100">
                                      <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                                   </div>
                                 )}
                              </div>
                              
                              {selectedFile && (
                                <Button 
                                  onClick={handleSubmitBill}
                                  isLoading={uploading}
                                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-12 shadow-lg shadow-emerald-100 rounded-xl"
                                >
                                  XÁC NHẬN ĐÃ CHUYỂN KHOẢN ✓
                                </Button>
                              )}
                           </div>

                           <p className="text-[10px] text-slate-500 italic bg-white/50 p-2 rounded border leading-relaxed">
                              * Vui lòng chuyển khoản đúng số tiền và nội dung <b>Coc_Don_{order.id}</b>. Sau khi chuyển hãy chụp lại màn hình và nộp tại đây để Admin duyệt đơn.
                           </p>
                        </div>
                     </div>
                  </CardContent>
                </Card>
              )}

              {/* Display submitted bill for buyer */}
              {order.status === "DEPOSIT_SUBMITTED" && order.depositBillUrl && (
                <Card className="border-blue-200 bg-blue-50/30">
                  <CardHeader className="bg-blue-100/30 py-3 border-b border-blue-100">
                    <CardTitle className="text-sm font-bold text-blue-800 uppercase flex items-center gap-2">
                      <Receipt className="h-4 w-4" /> BẰNG CHỨNG ĐÃ NỘP
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-center">
                    <p className="text-sm text-slate-500 mb-4">Bạn đã nộp hóa đơn cọc. Vui lòng chờ Admin phê duyệt.</p>
                    <div className="mx-auto max-w-sm rounded-xl overflow-hidden border shadow-sm">
                       <img 
                         src={filesApi.getDownloadUrl(order.depositBillUrl)} 
                         alt="Bill" 
                         className="w-full"
                       />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Escrow Holding Info */}
              {order.status === "ESCROW_HOLDING" && (
                <Card className="border-blue-200 bg-blue-50 ring-1 ring-blue-100">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-500 p-2 rounded-full text-white mt-1">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                         <h3 className="font-bold text-blue-900">Tiền đang được giam (3 ngày)</h3>
                         <p className="text-sm text-blue-800/80 mt-1">
                           Để đảm bảo quyền lợi của bạn, số tiền còn lại đang được sàn Marketplace tạm giữ trong 3 ngày kể từ lúc nhận hàng. Sau thời gian này, tiền sẽ được chuyển cho người bán.
                         </p>
                         <div className="mt-3 inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                            HOÀN TẤT VÀO: {order.escrowHoldAt ? formatDate(new Date(new Date(order.escrowHoldAt).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()) : 'Đang tính toán...'}
                         </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Confirm Delivery Action */}
              {((order.checkoutType === "DELIVERY" && (order.status === "SHIPPING" || order.status === "DELIVERED")) || 
                (order.checkoutType === "PICKUP" && (order.status === "PAID_DEPOSIT" || order.status === "PREPARING"))) && (
                <Card className="border-emerald-200 bg-emerald-50 ring-1 ring-emerald-100 shadow-sm">
                  <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                       <CheckCircle className="h-6 w-6 text-emerald-600" />
                       <div>
                         <p className="font-bold text-emerald-900">Bạn đã nhận được hàng chưa?</p>
                         <p className="text-sm text-emerald-800/80">Nhấn xác nhận nếu sản phẩm đúng như mô tả để sàn thực hiện thanh toán.</p>
                       </div>
                    </div>
                    <Button 
                      onClick={handleConfirmDelivery}
                      isLoading={actionLoading}
                      className="whitespace-nowrap bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      ĐÃ NHẬN HÀNG
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Sản phẩm mua ({order.items.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y border-t">
                    {order.items.map((item) => (
                      <div
                        key={`${order.id}-${item.productId}`}
                        className="px-6 py-6 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 font-bold border overflow-hidden">
                                {item.productImage ? (
                                  <img 
                                    src={filesApi.getDownloadUrl(item.productImage)} 
                                    alt={item.productName} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <span className="text-[10px]">NO IMG</span>
                                )}
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                  {item.productName}
                                </h3>
                                <p className="mt-0.5 text-xs text-slate-400 font-mono">
                                  SKU: #{item.productId}
                                </p>
                            </div>
                          </div>
                          <div className="text-sm text-slate-500 md:text-right">
                            <p className="flex justify-between md:block"><span className="md:hidden">Đơn giá:</span> {formatPrice(item.unitPrice)} x {item.quantity}</p>
                            <p className="font-bold text-slate-900 mt-1 flex justify-between md:block">
                              <span className="md:hidden">Thành tiền:</span> {formatPrice(item.lineTotal)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Tổng đơn hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="border-b pb-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Cửa hàng
                    </p>
                    <Link href={`/shops/${order.shopId}`} className="mt-2 text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                      {order.shopName} <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="border-b pb-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Hình thức vận chuyển
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-800">
                      {order.checkoutType === "DELIVERY" ? "🚛 Giao hàng tận nơi" : "🏃 Nhận tại cửa hàng"}
                    </p>
                  </div>
                  <div className="border-b pb-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Ngày tạo đơn
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-800">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>Tổng giá trị hàng</span>
                      <span className="font-bold text-slate-700">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500 font-medium">Tiền cọc (20%)</span>
                      <span className="font-bold text-slate-700">
                        {formatPrice(order.depositAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-500 font-medium">Trạng thái cọc</span>
                      <span className={`font-bold text-[10px] uppercase px-2 py-0.5 rounded ${order.status !== 'PENDING' && order.status !== 'DEPOSIT_SUBMITTED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {order.status !== 'PENDING' && order.status !== 'DEPOSIT_SUBMITTED' ? 'Đã thu cọc ✓' : 'Chưa thu cọc'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-base pt-3 border-t">
                      <span className="font-bold">Tiền mặt khi nhận hàng</span>
                      <div className="text-right">
                        <p className="font-extrabold text-primary text-xl tracking-tighter">
                          {order.status === 'PENDING' || order.status === 'DEPOSIT_SUBMITTED' ? formatPrice(order.totalAmount) : formatPrice(order.totalAmount - order.depositAmount)}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold italic mt-1 uppercase">
                           {(order.status === 'PENDING' || order.status === 'DEPOSIT_SUBMITTED') 
                               ? "(Bao gồm cả tiền cọc)" 
                               : "(Sau khi đã trừ cọc 20%)"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Link
                href="/orders"
                className="inline-flex h-12 w-full items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]"
              >
                Quay lại danh sách đơn
              </Link>
            </div>
          </div>
        ) : null}
      </PageContainer>
    </AppShell>
  );
}

