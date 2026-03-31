"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useCart } from "@/hooks/use-cart";
import { cartApi } from "@/lib/api";
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

function formatVND(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

export function CartPageContent() {
  const { items, loading, errorMessage, refreshCart, removeItem } = useCart();
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const totalCartPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.totalPrice, 0),
    [items],
  );

  async function handleUpdateQuantity(productId: number, newQuantity: number) {
    if (newQuantity < 1) {
      return;
    }

    setActionLoading(productId);
    try {
      await cartApi.add({ productId, quantity: newQuantity === 1 ? 1 : -1 });
      await refreshCart(true, true);
    } catch {
      toast.error("KhĂ´ng thá»ƒ cáº­p nháº­t sá»‘ lÆ°á»£ng");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRemoveItem(itemId: number) {
    setActionLoading(itemId);
    try {
      await removeItem(itemId);
      toast.success("ÄĂ£ xĂ³a sáº£n pháº©m");
    } catch {
      toast.error("Lá»—i khi xĂ³a sáº£n pháº©m");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <AppShell>
      <PageContainer>
        <SectionHeader
          eyebrow="Shopping Cart"
          title="Giá» hĂ ng cá»§a báº¡n"
          description={`Báº¡n cĂ³ ${items.length} sáº£n pháº©m trong giá» hĂ ng.`}
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {loading ? (
              <LoadingState
                title="Äang táº£i giá» hĂ ng"
                description="Vui lĂ²ng chá» trong giĂ¢y lĂ¡t."
              />
            ) : errorMessage ? (
              <ErrorState
                title="KhĂ´ng thá»ƒ táº£i giá» hĂ ng"
                description={errorMessage}
              />
            ) : items.length === 0 ? (
              <EmptyState
                title="Giá» hĂ ng trá»‘ng"
                description="HĂ£y thĂªm vĂ i sáº£n pháº©m Ä‘á»ƒ báº¯t Ä‘áº§u thanh toĂ¡n."
              />
            ) : (
              items.map((item) => (
                <Card key={item.itemId} className="overflow-hidden transition-all hover:shadow-md">
                  <CardContent className="p-0">
                    <div className="flex flex-col items-center gap-4 p-4 sm:flex-row">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={`https://picsum.photos/seed/${item.productId}/200`}
                          alt={item.productName}
                          width={96}
                          height={96}
                          sizes="96px"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold uppercase">
                          {item.productName}
                        </h3>
                        <p className="mt-1 font-bold text-accent">
                          {formatVND(item.productPrice)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 rounded-full border bg-muted/50 px-2 py-1">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          className="rounded-full p-1 transition-colors hover:bg-white hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-30"
                          disabled={item.quantity <= 1 || actionLoading === item.itemId}
                          aria-label={`Decrease quantity for ${item.productName}`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          className="rounded-full p-1 transition-colors hover:bg-white hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-30"
                          disabled={actionLoading === item.itemId}
                          aria-label={`Increase quantity for ${item.productName}`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="min-w-[100px] text-right sm:ml-4">
                        <p className="text-sm font-bold">{formatVND(item.totalPrice)}</p>
                        <button
                          onClick={() => handleRemoveItem(item.itemId)}
                          className="ml-auto mt-2 flex items-center gap-1 rounded-md px-2 py-1 text-xs text-destructive transition-colors hover:bg-red-50 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
                          disabled={actionLoading === item.itemId}
                          aria-label={`Remove ${item.productName} from cart`}
                        >
                          <Trash2 className="h-3 w-3" /> XĂ³a
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24 border-primary/10 bg-card shadow-lg">
              <CardHeader>
                <CardTitle>Tá»•ng Ä‘Æ¡n hĂ ng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Táº¡m tĂ­nh ({items.length} mĂ³n)</span>
                  <span>{formatVND(totalCartPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">PhĂ­ váº­n chuyá»ƒn</span>
                  <span className="font-medium text-green-600">Miá»…n phĂ­</span>
                </div>

                <div className="flex items-end justify-between border-t pt-4">
                  <span className="font-bold">Tá»•ng cá»™ng</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold leading-none text-accent">
                      {formatVND(totalCartPrice)}
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">(ÄĂ£ bao gá»“m VAT)</p>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className={`inline-flex h-12 w-full items-center justify-center rounded-md text-lg font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 ${
                    items.length === 0 || loading || !!errorMessage
                      ? "pointer-events-none border border-border bg-muted/50 text-muted-foreground"
                      : "bg-accent text-white shadow-lg shadow-accent/20 hover:opacity-90"
                  }`}
                >
                  THANH TOĂN NGAY
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
