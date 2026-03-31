"use client";

import { useMemo, useState } from "react";

import {
  AppShell,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorState,
  FormField,
  FormLabel,
  LoadingState,
  PageContainer,
  SectionHeader,
  Select,
} from "@/components/ui";
import { useCart } from "@/hooks/use-cart";
import { ordersApi } from "@/lib/api";
import type { CheckoutRequest, CheckoutType, OrderResponse } from "@/types";

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 2,
  }).format(value);
}

const initialForm: CheckoutRequest = {
  checkoutType: "PICKUP",
};

export function CheckoutPageContent() {
  const { items, loading, errorMessage: cartErrorMessage, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutRequest>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderResponse | null>(null);

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.totalPrice, 0),
    [items],
  );

  const depositAmount = form.checkoutType === "DELIVERY" ? totalPrice * 0.2 : 0;

  async function handleCheckout() {
    if (items.length === 0) {
      setCheckoutError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setCheckoutError(null);
    setSuccessMessage(null);

    try {
      const response = await ordersApi.checkout({
        checkoutType: form.checkoutType,
      });

      setOrder(response.data);
      clearCart();
      setSuccessMessage("Checkout completed successfully.");
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Unable to complete checkout",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <PageContainer className="px-0 lg:px-0">
        <SectionHeader
          eyebrow="Checkout"
          title="Checkout"
          description="Review your cart, choose a fulfillment method, and submit the order."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Checkout form</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <FormField>
                  <FormLabel htmlFor="checkout-type">Checkout type</FormLabel>
                  <Select
                    id="checkout-type"
                    value={form.checkoutType}
                    disabled={loading || submitting}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        checkoutType: event.target.value as CheckoutType,
                      }));
                    }}
                  >
                    <option value="PICKUP">Pickup</option>
                    <option value="DELIVERY">Delivery</option>
                  </Select>
                </FormField>

                {depositAmount > 0 && !order ? (
                  <div className="mt-4 flex flex-col items-center justify-center p-4 border border-orange-200 bg-orange-50 rounded-xl space-y-3">
                    <p className="font-semibold text-orange-800">Quét mã QR để đặt cọc</p>
                    <img 
                      src={`https://img.vietqr.io/image/970422-0123456789-compact2.png?amount=${depositAmount}&addInfo=ThanhToanCoc&accountName=MARKETPLACE`} 
                      alt="VietQR"
                      className="w-48 h-48 rounded-lg shadow-sm"
                    />
                    <p className="text-xs text-orange-600/80 text-center max-w-[250px]">
                      Sử dụng App ngân hàng hoặc VNPay quét mã này để chuyển khoản số tiền cọc {formatPrice(depositAmount)}.
                    </p>
                  </div>
                ) : null}

                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCheckout}
                  isLoading={submitting}
                  disabled={loading || !!cartErrorMessage || !!checkoutError || items.length === 0}
                  className="w-full bg-slate-900 text-white hover:bg-slate-800 mt-4"
                >
                  {depositAmount > 0 ? "Tôi đã chuyển khoản - Xác nhận" : "Xác nhận đặt hàng"}
                </Button>
              </CardContent>
            </Card>

            {cartErrorMessage || checkoutError ? (
              <ErrorState
                title="KhĂ´ng thá»ƒ tiáº¿p tá»¥c thanh toĂ¡n"
                description={checkoutError ?? cartErrorMessage ?? undefined}
              />
            ) : null}

            {successMessage ? (
              <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 px-5 py-4 text-sm text-emerald-700">
                {successMessage}
              </div>
            ) : null}

            {loading ? (
              <LoadingState
                title="Äang táº£i giá» hĂ ng"
                description="ThĂ´ng tin thanh toĂ¡n sáº½ xuáº¥t hiá»‡n ngay sau khi dá»¯ liá»‡u sáºµn sĂ ng."
              />
            ) : null}

            {!loading && !cartErrorMessage && !checkoutError && items.length === 0 && !order ? (
              <EmptyState
                title="ChÆ°a cĂ³ sáº£n pháº©m Ä‘á»ƒ thanh toĂ¡n"
                description="HĂ£y thĂªm sáº£n pháº©m vĂ o giá» hĂ ng trÆ°á»›c khi tiáº¿p tá»¥c."
              />
            ) : null}

            {!loading && !cartErrorMessage && !checkoutError && items.length > 0 ? (
              <div className="grid gap-4">
                {items.map((item) => (
                  <Card key={item.itemId}>
                    <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
                          {item.productName}
                        </h3>
                        <div className="grid gap-1.5 text-sm text-[var(--muted)]">
                          <p>Price: {formatPrice(item.productPrice)}</p>
                          <p>Quantity: {item.quantity}</p>
                          <p>Total: {formatPrice(item.totalPrice)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : null}

            {order ? (
              <Card>
                <CardHeader>
                  <CardTitle>Order created</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-[var(--muted)]">
                  <p>
                    Order id:{" "}
                    <span className="font-medium text-[var(--foreground)]">
                      {order.id}
                    </span>
                  </p>
                  <p>
                    Status:{" "}
                    <span className="font-medium text-[var(--foreground)]">
                      {order.status}
                    </span>
                  </p>
                  <p>
                    Shop:{" "}
                    <span className="font-medium text-[var(--foreground)]">
                      {order.shopName}
                    </span>
                  </p>
                </CardContent>
              </Card>
            ) : null}
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Order summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                  <span>Checkout type</span>
                  <span className="font-medium text-[var(--foreground)]">
                    {form.checkoutType}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                  <span>Total price</span>
                  <span className="font-medium text-[var(--foreground)]">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                  <span>Deposit amount</span>
                  <span className="font-medium text-[var(--foreground)]">
                    {formatPrice(depositAmount)}
                  </span>
                </div>
                <div className="border-t border-[var(--border)] pt-4 text-sm leading-7 text-[var(--muted)]">
                  {form.checkoutType === "DELIVERY"
                    ? "Delivery requires a 20% deposit."
                    : "Pickup requires no deposit."}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
