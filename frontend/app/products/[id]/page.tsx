import Link from "next/link";
import { Calendar, ChevronLeft, Info, MapPin, MessageCircle, ShieldCheck, Store, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

import { ProductAddToCart } from "@/components/product/product-add-to-cart";
import { ProductComments } from "@/components/product/product-comments";
import { ProductFavoriteToggle } from "@/components/product/product-favorite-toggle";
import { ProductGallery } from "@/components/product/product-gallery";
import {
  AppShell,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ErrorState,
  PageContainer,
} from "@/components/ui";
import { productsApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { ProductResponse, ProductStatus } from "@/types";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

const STATUS_MAP: Record<
  ProductStatus,
  { label: string; variant: "accent" | "outline" | "neutral" }
> = {
  ACTIVE: { label: "Đang bán", variant: "accent" },
  SOLD: { label: "Đã bán", variant: "outline" },
  HIDDEN: { label: "Tạm ẩn", variant: "neutral" },
};

function formatVND(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const productId = Number(id);

  let product: ProductResponse | null = null;
  let errorMessage: string | null = null;

  try {
    const response = await productsApi.getById(productId);
    product = response.data;
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Không thể tải sản phẩm";
  }

  if (errorMessage) {
    return (
      <AppShell>
        <PageContainer>
          <ErrorState
            title="Khong the tai san pham"
            description={errorMessage}
            className="mt-10"
          />
        </PageContainer>
      </AppShell>
    );
  }

  if (!product) {
    return null;
  }

  const statusInfo = STATUS_MAP[product.status] || STATUS_MAP.HIDDEN;

  return (
    <AppShell>
      <PageContainer>
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/products" className="flex items-center transition-colors hover:text-primary">
            <ChevronLeft className="h-4 w-4" />
            <span>Quay lại danh sách</span>
          </Link>
          <span>/</span>
          <span className="max-w-[200px] truncate">{product.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7 xl:col-span-8">
            <ProductGallery imageUrls={product.imageUrls} productName={product.name} />

            <Card className="border-none bg-transparent shadow-none">
              <CardHeader className="border-none px-0 pt-0">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
                  <ShieldCheck className="h-4 w-4" />
                  {product.categoryName}
                  <Badge variant={statusInfo.variant} className="ml-2">
                    {statusInfo.label}
                  </Badge>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  {product.name}
                </h1>

                <div className="mt-4 flex items-center gap-6">
                   <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                         {[1, 2, 3, 4, 5].map(s => (
                            <Star 
                               key={s} 
                               className={cn(
                                  "h-4 w-4", 
                                  s <= Math.round(product.averageRating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-200"
                               )} 
                            />
                         ))}
                      </div>
                      <span className="text-sm font-black text-slate-900">{product.averageRating?.toFixed(1) || "5.0"}</span>
                   </div>
                   
                   <div className="h-4 w-px bg-slate-200" />
                   
                   <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900">{product.soldCount || 0}</span>
                      <span className="text-sm font-bold text-slate-400">Đã bán</span>
                   </div>
                </div>

                <p className="mt-6 text-3xl font-black text-accent">{formatVND(product.price)}</p>
              </CardHeader>

              <CardContent className="mt-6 space-y-8 px-0">
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-lg font-bold">
                    <Info className="h-5 w-5 text-primary" />
                    Mô tả chi tiết
                  </h3>
                  <p className="whitespace-pre-line rounded-xl border border-border/50 bg-muted/30 p-4 text-base leading-relaxed text-foreground/80">
                    {product.description}
                  </p>
                </div>

                <div className="border-t border-border pt-6">
                  <ProductComments productId={product.id} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 lg:col-span-5 xl:col-span-4">
            <aside className="sticky top-24 space-y-6">
              <Card className="border-2 border-primary/10 p-6 shadow-xl shadow-primary/5">
                <div className="flex flex-col gap-4">
                  <ProductAddToCart productId={product.id} />

                  <div className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-3 font-bold text-muted-foreground">
                    <MessageCircle className="h-5 w-5" />
                    Chat coming soon
                  </div>

                  <ProductFavoriteToggle productId={product.id} />
                </div>

                <p className="mt-4 text-center text-[11px] text-muted-foreground">
                  Giao dịch trực tiếp để tránh rủi ro.
                  <Link href="/safety" className="ml-1 underline">
                    Tìm hiểu thêm
                  </Link>
                </p>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="border-b border-border bg-muted/50 p-4">
                  <CardTitle className="flex items-center gap-2 text-sm font-bold">
                    <Store className="h-4 w-4" /> Thông tin người bán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                      {product.shopName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{product.shopName}</p>
                      <p className="text-xs italic text-muted-foreground">Shop mới tham gia</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" /> Khu vực:
                      </span>
                      <span className="font-medium text-foreground">Hồ Chí Minh</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> Đăng lúc:
                      </span>
                      <span className="font-medium text-foreground">
                        {formatDistanceToNow(new Date(product.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5" /> Tình trạng:
                      </span>
                      <span className="font-bold text-primary">{product.condition}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
