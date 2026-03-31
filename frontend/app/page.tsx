import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { ProductCard } from "@/components/product/product-card";
import {
  AppShell,
  EmptyState,
  ErrorState,
  PageContainer,
  SectionHeader,
} from "@/components/ui";
import { productsApi } from "@/lib/api";
import { ProductResponse } from "@/types";

import { HomeBanner } from "@/components/home/home-banner";

export default async function Home() {
  let products: ProductResponse[] = [];
  let error = null;

  try {
    const response = await productsApi.getAll();
    products = response.data || response.data;
  } catch (e) {
    console.error("Fetch products failed:", e);
    error = "Không thể tải danh sách sản phẩm.";
  }

  return (
    <AppShell>
      <PageContainer className="py-8">
        <HomeBanner />

        <SectionHeader
          title="Sản phẩm mới nhất"
          description="Những món đồ vừa được lên kệ."
        />

        {error ? (
          <ErrorState
            title="Không thể tải sản phẩm"
            description={error}
            className="mt-6"
          />
        ) : products.length === 0 ? (
          <EmptyState
            title="Chưa có sản phẩm nào"
            description="Những món đồ mới sẽ xuất hiện tại đây khi cửa hàng bắt đầu đăng bán."
            className="mt-6"
          />
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((p: ProductResponse) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </PageContainer>
    </AppShell>
  );
}
