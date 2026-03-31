"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Truck, Store, ArrowRight, ShieldCheck, Info } from "lucide-react";
import { toast } from "sonner";

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
import { ordersApi, filesApi } from "@/lib/api";
import type { CheckoutRequest, CheckoutType } from "@/types";

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
  const router = useRouter();
  const { items, loading, errorMessage: cartErrorMessage, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutRequest>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.totalPrice, 0),
    [items],
  );

  const depositAmount = form.checkoutType === "DELIVERY" ? totalPrice * 0.2 : 0;

  async function handleCheckout() {
    if (items.length === 0) {
      setCheckoutError("Giỏ hàng của bạn đang trống.");
      return;
    }

    setSubmitting(true);
    setCheckoutError(null);

    try {
      const response = await ordersApi.checkout({
        checkoutType: form.checkoutType,
      });

      if (response.success) {
        toast.success("Đặt hàng thành công!");
        clearCart();
        // Chuyển hướng ngay đến trang chi tiết để thực hiện quy trình cọc/vận chuyển
        router.push(`/orders/${response.data.id}`);
      }
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Không thể hoàn tất đặt hàng",
      );
      toast.error("Đã xảy ra lỗi khi đặt hàng.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <PageContainer>
          <LoadingState 
            title="Đang chuẩn bị vận đơn" 
            description="Vui lòng chờ trong giây lát..." 
          />
        </PageContainer>
      </AppShell>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <AppShell>
        <PageContainer>
           <div className="mt-10">
              <EmptyState
                title="Chưa có sản phẩm để thanh toán"
                description="Hãy thêm sản phẩm vào giỏ hàng trước khi tiếp tục."
                action={
                  <Button onClick={() => router.push("/")} variant="secondary">
                    Quay lại mua sắm
                  </Button>
                }
              />
           </div>
        </PageContainer>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageContainer className="px-0 lg:px-0">
        <SectionHeader
          eyebrow="Giao dịch bảo mật"
          title="Xác nhận Thanh toán"
          description="Kiểm tra lại giỏ hàng và chọn phương thức nhận hàng phù hợp."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
          <div className="space-y-6">
            <Card className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200">
              <CardHeader className="bg-slate-50 border-b py-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-primary" /> Sản phẩm thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                   {items.map((item) => (
                     <div key={item.itemId} className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors">
                        <div className="h-20 w-20 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden border">
                           <Image
                              src={item.productImage 
                                ? filesApi.getDownloadUrl(item.productImage.split('/').pop() || '') 
                                : `https://picsum.photos/seed/${item.productId}/200`}
                              alt={item.productName}
                              width={80}
                              height={80}
                              className="h-full w-full object-cover"
                           />
                        </div>
                        <div className="flex-1">
                           <h3 className="font-bold text-slate-900">{item.productName}</h3>
                           <p className="text-sm text-slate-500 mt-0.5">{formatPrice(item.productPrice)} x {item.quantity}</p>
                        </div>
                        <div className="text-right">
                           <p className="font-extrabold text-slate-900">{formatPrice(item.totalPrice)}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-slate-200">
               <CardHeader className="py-4 border-b">
                 <CardTitle className="text-base">Phương thức nhận hàng</CardTitle>
               </CardHeader>
               <CardContent className="p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                     <button
                        onClick={() => setForm({ checkoutType: "PICKUP" })}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${form.checkoutType === "PICKUP" ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                     >
                        <div className={`p-3 rounded-full ${form.checkoutType === "PICKUP" ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                           <Store className="h-6 w-6" />
                        </div>
                        <div className="text-center">
                           <p className="font-bold text-slate-900">Nhận tại cửa hàng</p>
                           <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">Miễn phí cọc</p>
                        </div>
                     </button>

                     <button
                        onClick={() => setForm({ checkoutType: "DELIVERY" })}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${form.checkoutType === "DELIVERY" ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                     >
                        <div className={`p-3 rounded-full ${form.checkoutType === "DELIVERY" ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                           <Truck className="h-6 w-6" />
                        </div>
                        <div className="text-center">
                           <p className="font-bold text-slate-900">Giao hàng tận nơi</p>
                           <p className="text-[10px] text-accent mt-1 uppercase font-bold tracking-wider">Cọc 20% bảo hiểm</p>
                        </div>
                     </button>
                  </div>
               </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-xl ring-1 ring-slate-200 sticky top-24">
              <CardHeader className="bg-slate-900 text-white border-none py-6 rounded-t-2xl">
                <CardTitle className="text-xl flex items-center justify-between">
                  Tổng kết <ShoppingBag className="h-5 w-5 opacity-50" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium tracking-tight">Tạm tính ({items.length} sp)</span>
                  <span className="font-bold text-slate-900">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Phí vận chuyển</span>
                  <span className="font-bold text-emerald-600">Miễn phí</span>
                </div>

                {form.checkoutType === "DELIVERY" && (
                  <div className="flex items-center justify-between text-sm p-3 bg-accent/5 rounded-xl border border-accent/10">
                    <span className="text-accent font-bold">Yêu cầu cọc (20%)</span>
                    <span className="font-extrabold text-accent">
                      {formatPrice(depositAmount)}
                    </span>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Tổng cộng</span>
                    <span className="text-2xl font-black text-primary tracking-tighter">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-xl flex gap-3 items-start border border-blue-100">
                     <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                     <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
                        {form.checkoutType === "DELIVERY" 
                          ? "Bạn sẽ thực hiện chuyển khoản cọc sau khi nhấn xác nhận để người bán chuẩn bị hàng." 
                          : "Vui lòng xác nhận để đặt giữ hàng. Bạn sẽ thanh toán trực tiếp khi đến shop."}
                     </p>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    isLoading={submitting}
                    className="w-full h-14 bg-primary hover:bg-primary/95 text-white font-black text-base rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    XÁC NHẬN ĐẶT HÀNG <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2 grayscale opacity-50">
                   <ShieldCheck className="h-4 w-4" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Escrow Protected</span>
                </div>
              </CardContent>
            </Card>

            {(cartErrorMessage || checkoutError) && (
              <ErrorState
                title="Lỗi thanh toán"
                description={checkoutError ?? cartErrorMessage ?? undefined}
              />
            )}
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
