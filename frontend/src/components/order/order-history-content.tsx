"use client";

import Link from "next/link";
import { Clock, Receipt, ShoppingBag, Store, ChevronRight, Star, ExternalLink } from "lucide-react";
import { filesApi } from "@/lib/api/files";

import {
  AppShell,
  Card,
  CardContent,
  EmptyState,
  ErrorState,
  LoadingState,
  PageContainer,
  SectionHeader,
} from "@/components/ui";
import { useOrders } from "@/hooks/use-orders";
import { OrderStatusBadge } from "@/components/order/order-status-badge";

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function OrderHistoryContent() {
  const { orders, loading, errorMessage } = useOrders();

  return (
    <AppShell>
      <PageContainer className="px-0 lg:px-0">
        <SectionHeader
          eyebrow="Giao dịch"
          title="Lịch sử mua hàng"
          description="Xem lại trạng thái đơn hàng và chi tiết các lần mua sắm trước đây của bạn."
        />

        <div className="mt-10 grid gap-6">
          {loading ? (
            <LoadingState
              title="Đang tải đơn hàng"
              description="Lịch sử đơn hàng sẽ hiển thị ngay khi dữ liệu sẵn sàng."
            />
          ) : errorMessage ? (
            <ErrorState
              title="Không thể tải đơn hàng"
              description={errorMessage}
            />
          ) : orders.length === 0 ? (
            <EmptyState
              title="Chưa có đơn hàng nào"
              description="Khi bạn hoàn tất thanh toán, đơn hàng sẽ xuất hiện tại đây."
            />
          ) : (
            <div className="grid gap-8">
              {orders.map((order) => {
                const isEligibleForReview = order.status === "DELIVERED" || order.status === "COMPLETED";
                
                return (
                  <Card key={order.id} className="group overflow-hidden rounded-[2rem] border-slate-50 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]">
                    <CardContent className="p-0">
                      {/* Card Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 bg-slate-50/50 border-b border-slate-50">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] bg-primary text-white font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md shadow-primary/20">
                               #{order.id}
                             </span>
                             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                               Đặt ngày {formatDate(order.createdAt)}
                             </span>
                          </div>
                          <h3 className="text-xl font-black tracking-tight text-slate-900 mt-3 flex items-center gap-2 group-hover:text-primary transition-colors">
                            <Store className="h-5 w-5 text-primary/40" /> {order.shopName}
                          </h3>
                        </div>
                        <div className="flex flex-col md:items-end gap-3">
                          <OrderStatusBadge status={order.status} />
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="p-8 space-y-6">
                        <div className="space-y-4">
                          {order.items.map((item) => {
                            const thumbnail = item.productImage 
                              ? filesApi.getDownloadUrl(item.productImage.split('/').pop() || '')
                              : null;

                            return (
                              <div
                                key={`${order.id}-${item.productId}`}
                                className="flex items-center gap-4 group/item"
                              >
                                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100 border border-slate-50">
                                   {thumbnail ? (
                                      <img src={thumbnail} alt={item.productName} className="h-full w-full object-cover transition-transform duration-500 group-hover/item:scale-110" />
                                   ) : (
                                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                                         <ShoppingBag className="h-6 w-6" />
                                      </div>
                                   )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                   <Link href={`/products/${item.productId}`} className="text-sm font-bold text-slate-800 hover:text-primary transition-colors line-clamp-1">
                                      {item.productName}
                                   </Link>
                                   <p className="text-xs text-slate-400 font-medium">
                                      {item.quantity} x {formatPrice(item.unitPrice)}
                                   </p>
                                </div>

                                {isEligibleForReview && (
                                   <Link 
                                      href={`/products/${item.productId}#reviews`}
                                      className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-100 transition-all active:scale-95"
                                   >
                                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                      Đánh giá
                                   </Link>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 pt-0 mt-2">
                         <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                               <Receipt className="h-5 w-5" />
                            </div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Tổng thanh toán</p>
                               <p className="text-2xl font-black text-primary tracking-tighter">
                                 {formatPrice(order.totalAmount)}
                               </p>
                            </div>
                         </div>

                         <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Link
                              href={`/orders/${order.id}`}
                              className="flex-1 sm:flex-none h-12 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 text-[11px] font-black text-white uppercase tracking-widest shadow-xl shadow-slate-200 transition-all hover:bg-slate-800 active:scale-95"
                            >
                              Xem chi tiết <ExternalLink className="h-4 w-4" />
                            </Link>
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </PageContainer>
    </AppShell>
  );
}
