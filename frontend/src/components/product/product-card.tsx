"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Clock, MapPin, ShieldCheck, ShoppingCart, Image as ImageIcon, Trash2, Store, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

import { Badge, Button, Card, CardContent } from "@/components/ui";
import { FavoriteButton } from "@/components/product/favorite-button";
import { useCart } from "@/hooks/use-cart";
import { filesApi } from "@/lib/api/files";
import type { CategoryResponse, ProductResponse, ProductStatus } from "@/types";

interface ProductCardProps {
  product: ProductResponse;
  category?: CategoryResponse;
  onRemove?: () => void;
}

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

export function ProductCard({ product, category, onRemove }: ProductCardProps) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const categoryName = category?.name ?? product.categoryName;
  const statusInfo = STATUS_MAP[product.status] || STATUS_MAP.HIDDEN;

  const mainImage = product.imageUrls && product.imageUrls.length > 0 
    ? filesApi.getDownloadUrl(product.imageUrls[0].split('/').pop() || '')
    : null;

  async function handleAddToCart(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (product.status !== "ACTIVE" || adding) {
      return;
    }

    setAdding(true);
    try {
      await addItem(product.id, 1, {
        productName: product.name,
        productPrice: product.price,
      });
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="group relative h-full">
      <Link
        href={`/products/${product.id}`}
        className="block h-full rounded-[2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
      >
        <Card className="h-full overflow-hidden border-slate-50 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] rounded-[2rem]">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300">
                <ImageIcon className="h-12 w-12" />
              </div>
            )}

            <div className="absolute left-4 top-4 flex flex-col gap-2">
              <Badge variant={statusInfo.variant} className="shadow-lg backdrop-blur-md px-3 py-1 font-black text-[10px] uppercase tracking-widest border-none">
                {statusInfo.label}
              </Badge>
              {onRemove && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemove();
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-xl shadow-red-500/20 transition-all hover:bg-red-600 active:scale-90"
                  title="Xóa khỏi yêu thích"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="absolute right-3 top-3 z-10 translate-x-12 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
              <FavoriteButton productId={product.id} />
            </div>

            <div className="absolute right-4 bottom-4">
              <span className="rounded-xl bg-slate-900/80 px-3 py-1.5 text-[9px] font-black text-white backdrop-blur-md uppercase tracking-widest">
                {product.condition === "USED" ? "Đồ cũ" : "Mới"}
              </span>
            </div>
          </div>

          <CardContent className="p-6 flex flex-col flex-1">
            <div className="mb-2 flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">
              <ShieldCheck className="h-3.5 w-3.5" />
              {categoryName}
            </div>

            <h3 className="line-clamp-2 min-h-[3rem] text-base font-black leading-tight text-slate-800 transition-colors group-hover:text-primary tracking-tight">
              {product.name}
            </h3>

            <div className="mt-auto pt-6 flex items-end justify-between border-t border-slate-50">
              <div className="space-y-1">
                 <p className="text-[10px] font-bold text-slate-400 leading-none uppercase tracking-widest">Giá thanh lý</p>
                 <p className="text-xl font-black text-slate-900 tracking-tighter">
                   {formatVND(product.price)}
                 </p>
              </div>

              <Button
                size="icon"
                variant="ghost"
                className="h-11 w-11 rounded-2xl bg-slate-50 text-slate-400 transition-all hover:bg-primary hover:text-white"
                disabled={product.status !== "ACTIVE"}
                isLoading={adding}
                onClick={handleAddToCart}
                title={
                  product.status === "ACTIVE"
                    ? "Add to cart"
                    : "This product is not available for cart actions"
                }
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-50 pt-4">
               <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                     <Store className="h-3 w-3 text-primary/40 shrink-0" />
                     <span className="truncate text-[10px] font-bold text-slate-400">{product.shopName}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 rounded-md border border-amber-100/50 shrink-0">
                     <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                     <span className="text-[9px] font-black text-amber-700">
                        {product.averageRating > 0 ? product.averageRating.toFixed(1) : "5.0"}
                     </span>
                  </div>
               </div>

               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">
                     Đã bán {product.soldCount || 0}
                  </span>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-slate-300">
                     <Clock className="h-2.5 w-2.5" />
                     <span>
                        {formatDistanceToNow(new Date(product.createdAt), {
                           addSuffix: true,
                           locale: vi,
                        })}
                     </span>
                  </div>
               </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
