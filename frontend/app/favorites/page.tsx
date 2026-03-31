"use client";

import { useEffect, useState } from "react";
import { Heart, Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { AppShell, Button, EmptyState, PageContainer, SectionHeader } from "@/components/ui";
import { ProductCard } from "@/components/product/product-card";
import { favoritesApi } from "@/lib/api/favorites";
import { productsApi } from "@/lib/api/products";
import { useAuth } from "@/hooks/use-auth";
import type { ProductResponse } from "@/types";

export default function FavoritesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLoading(false);
      return;
    }

    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated, authLoading]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      // 1. Lấy danh sách ID sản phẩm yêu thích
      const response = await favoritesApi.get();
      const favorites = response.data || [];
      
      if (favorites.length === 0) {
        setProducts([]);
        return;
      }

      // 2. Lấy thông tin chi tiết cho từng sản phẩm
      const productPromises = favorites.map((f: any) => productsApi.getById(f.productId));
      const productResponses = await Promise.all(productPromises);
      
      // Lọc ra các sản phẩm hợp lệ từ ApiResponse.data
      const validProducts = productResponses
        .filter(response => response.success && response.data)
        .map(response => response.data!);
        
      setProducts(validProducts);
    } catch (error) {
      console.error("Failed to load favorites:", error);
      toast.error("Không thể tải danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (productId: number) => {
    try {
      await favoritesApi.remove(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success("Đã xóa khỏi danh sách yêu thích");
    } catch (error) {
      toast.error("Không thể xóa sản phẩm");
    }
  };

  if (authLoading || (loading && products.length === 0)) {
    return (
      <AppShell>
        <PageContainer className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </PageContainer>
      </AppShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <AppShell>
        <PageContainer>
          <EmptyState
            title="Bạn chưa đăng nhập"
            description="Hãy đăng nhập để xem danh sách sản phẩm yêu thích của mình."
            action={
              <Link href="/login">
                <Button>Đăng nhập ngay</Button>
              </Link>
            }
          />
        </PageContainer>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageContainer>
        <SectionHeader
          eyebrow="My Favorites"
          title="Sản phẩm yêu thích"
          description={`Bạn đang lưu ${products.length} sản phẩm mà bạn quan tâm.`}
        />

        {products.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              icon={<Heart className="h-12 w-12 text-muted-foreground/40" />}
              title="Chưa có sản phẩm yêu thích"
              description="Hãy dạo quanh cửa hàng và nhấn vào biểu tượng trái tim để lưu lại những món đồ bạn thích nhé."
              action={
                <Link href="/products">
                  <Button variant="outline" className="gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Khám phá ngay
                  </Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onRemove={() => handleRemoveProduct(product.id)}
              />
            ))}
          </div>
        )}
      </PageContainer>
    </AppShell>
  );
}
