"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { OrderStatusBadge } from "@/components/order/order-status-badge";
import {
  AppShell,
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
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const orderId = rawId ? Number(rawId) : null;
  const { order, loading, errorMessage } = useOrderDetail(orderId);

  return (
    <AppShell>
      <PageContainer className="px-0 lg:px-0">
        <SectionHeader
          eyebrow="Orders"
          title={order ? `Order #${order.id}` : `Order Detail #${rawId ?? ""}`}
          description="Order detail view with status, pricing, and purchased items."
          action={order ? <OrderStatusBadge status={order.status} /> : null}
        />

        {loading ? (
          <LoadingState
            title="Dang tai chi tiet don hang"
            description="Vui long cho trong giay lat."
            className="mt-10"
          />
        ) : null}

        {!loading && errorMessage ? (
          <ErrorState
            title="Khong the tai chi tiet don hang"
            description={errorMessage}
            className="mt-10"
          />
        ) : null}

        {!loading && !errorMessage && !order ? (
          <EmptyState
            title="Khong tim thay don hang"
            description="Don hang nay khong ton tai hoac ban khong con quyen truy cap."
            className="mt-10"
          />
        ) : null}

        {!loading && order ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
            <Card>
              <CardHeader>
                <CardTitle>Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={`${order.id}-${item.productId}`}
                    className="border border-[var(--border)] bg-white px-5 py-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-[var(--foreground)]">
                          {item.productName}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          Product #{item.productId}
                        </p>
                      </div>
                      <div className="text-sm text-[var(--muted)] md:text-right">
                        <p>Quantity: {item.quantity}</p>
                        <p>Unit price: {formatPrice(item.unitPrice)}</p>
                        <p className="font-medium text-[var(--foreground)]">
                          Line total: {formatPrice(item.lineTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="border-b border-[var(--border)] pb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                      Shop
                    </p>
                    <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                      {order.shopName}
                    </p>
                  </div>
                  <div className="border-b border-[var(--border)] pb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                      Checkout type
                    </p>
                    <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                      {order.checkoutType}
                    </p>
                  </div>
                  <div className="border-b border-[var(--border)] pb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                      Created
                    </p>
                    <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                      <span>Total price</span>
                      <span className="font-medium text-[var(--foreground)]">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                      <span>Deposit</span>
                      <span className="font-medium text-[var(--foreground)]">
                        {formatPrice(order.depositAmount)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Link
                href="/orders"
                className="inline-flex h-10 items-center justify-center border border-[var(--border)] bg-white px-4 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-muted/50"
              >
                Back to orders
              </Link>
            </div>
          </div>
        ) : null}
      </PageContainer>
    </AppShell>
  );
}
