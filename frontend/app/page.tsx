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
        <div className="mb-10 rounded-2xl bg-gradient-to-r from-primary to-teal-600 p-8 text-white shadow-lg md:p-12">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold leading-tight md:text-5xl">
              Săn đồ cũ giá hời,
              <br />
              chất lượng mới 99%
            </h1>
            <p className="mt-4 text-sm opacity-90 md:text-lg">
              Cộng đồng mua bán đồ cũ uy tín nhất hiện nay.
            </p>
            <Link
              href="/shops/register"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-primary transition-all hover:bg-gray-100"
            >
              <PlusCircle className="h-5 w-5" /> Mở shop ngay
            </Link>
          </div>
        </div>

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
