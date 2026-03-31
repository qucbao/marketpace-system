"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Clock, MapPin, ShieldCheck, ShoppingCart, Image as ImageIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

import { Badge, Button, Card, CardContent } from "@/components/ui";
import { useCart } from "@/hooks/use-cart";
import { filesApi } from "@/lib/api/files";
import type { CategoryResponse, ProductResponse, ProductStatus } from "@/types";

interface ProductCardProps {
  product: ProductResponse;
  category?: CategoryResponse;
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

export function ProductCard({ product, category }: ProductCardProps) {
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
        className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
      >
        <Card className="h-full overflow-hidden border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
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

            <div className="absolute left-3 top-3">
              <Badge variant={statusInfo.variant} className="shadow-sm backdrop-blur-md">
                {statusInfo.label}
              </Badge>
            </div>

            <div className="absolute right-3 bottom-3">
              <span className="rounded-md bg-black/50 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                {product.condition === "USED" ? "Đồ cũ" : "Mới"}
              </span>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary">
              <ShieldCheck className="h-3 w-3" />
              {categoryName}
            </div>

            <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
              {product.name}
            </h3>

            <div className="mt-4 flex items-start justify-between gap-3">
              <p className="text-xl font-extrabold text-accent">
                {formatVND(product.price)}
              </p>

              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 rounded-full border-dashed text-muted-foreground hover:border-primary/40 hover:text-primary"
                disabled={product.status !== "ACTIVE"}
                isLoading={adding}
                onClick={handleAddToCart}
                title={
                  product.status === "ACTIVE"
                    ? "Add to cart"
                    : "This product is not available for cart actions"
                }
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 flex flex-col gap-1.5 border-t border-border pt-3 text-[11px] text-muted-foreground">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 truncate font-medium">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="truncate">{product.shopName}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {formatDistanceToNow(new Date(product.createdAt), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
