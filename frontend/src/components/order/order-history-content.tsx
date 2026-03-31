"use client";

import Link from "next/link";

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
          eyebrow="Orders"
          title="Order history"
          description="Review previous checkouts, current order status, and item summaries."
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
                      <div className="space-y-2.5">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                          Order #{order.id}
                        </p>
                        <h3 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
                          {order.shopName}
                        </h3>
                        <p className="text-sm text-[var(--muted)]">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-col items-start gap-3 md:items-end">
                        <OrderStatusBadge status={order.status} />
                        <div className="text-sm text-[var(--muted)]">
                          <p>Total: {formatPrice(order.totalAmount)}</p>
                          <p>Deposit: {formatPrice(order.depositAmount)}</p>
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

                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex h-10 items-center justify-center border border-[var(--border)] bg-white px-4 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-muted/50"
                    >
                      View details
                    </Link>
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
