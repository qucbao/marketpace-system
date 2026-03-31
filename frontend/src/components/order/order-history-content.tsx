"use client";

import Link from "next/link";
import { Clock, Receipt, ShoppingBag, Store, ChevronRight } from "lucide-react";

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
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                             Đơn #{order.id}
                           </span>
                           <span className="text-[10px] text-slate-400 font-medium italic">
                             Đặt ngày: {formatDate(order.createdAt)}
                           </span>
                        </div>
                        <h3 className="text-lg font-black tracking-tight text-slate-900 mt-2 flex items-center gap-2">
                          <Store className="h-4 w-4 text-primary" /> {order.shopName}
                        </h3>
                      </div>
                      <div className="flex flex-col items-start gap-2 md:items-end">
                        <OrderStatusBadge status={order.status} />
                        <div className="text-right">
                           <p className="text-xs text-slate-400">Tổng cộng</p>
                           <p className="font-black text-primary text-lg tracking-tighter">
                             {formatPrice(order.totalAmount)}
                           </p>
                        </div>
                      </div>
                    </div>


                    <div className="border-t border-[var(--border)] pt-4">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                        Items
                      </p>
                      <div className="space-y-2.5">
                        {order.items.map((item) => (
                          <div
                            key={`${order.id}-${item.productId}`}
                            className="flex items-center justify-between gap-4 text-sm text-[var(--foreground)]"
                          >
                            <span>{item.productName}</span>
                            <span className="text-[var(--muted)]">
                              {item.quantity} x {formatPrice(item.unitPrice)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                       <p className="text-xs text-slate-500">
                          Gồm <b>{order.items.length}</b> mặt hàng
                       </p>
                       <Link
                         href={`/orders/${order.id}`}
                         className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-white border border-slate-200 px-6 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-100 hover:border-slate-300 active:scale-[0.98]"
                       >
                         Xem chi tiết <ChevronRight className="h-4 w-4" />
                       </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </AppShell>
  );
}
