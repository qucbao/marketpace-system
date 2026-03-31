import { Filter, SlidersHorizontal } from "lucide-react";

import { ProductCard } from "@/components/product/product-card";
import {
  AppShell,
  Badge,
  Checkbox,
  EmptyState,
  Input,
  PageContainer,
  SectionHeader,
  Select,
} from "@/components/ui";
import { categoriesApi, productsApi } from "@/lib/api";

export default async function ProductsPage() {
  const products = (await productsApi.getAll()).data;
  const categories = (await categoriesApi.getAll()).data;

  return (
    <AppShell>
      <PageContainer>
        <SectionHeader
          title="Khám phá sản phẩm"
          description="Tìm kiếm những món đồ cũ chất lượng từ cộng đồng."
          action={<Badge variant="accent">{products.length} sản phẩm</Badge>}
        />

        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <aside className="hidden w-64 shrink-0 space-y-8 lg:block">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                  <Filter className="h-4 w-4" /> Danh mục
                </h3>
                <Badge variant="outline">Soon</Badge>
              </div>
              <fieldset className="space-y-2 opacity-60" disabled>
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3 text-sm">
                    <Checkbox />
                    {cat.name}
                  </label>
                ))}
              </fieldset>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                  <SlidersHorizontal className="h-4 w-4" /> Khoảng giá
                </h3>
                <Badge variant="outline">Soon</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 opacity-60">
                <Input type="number" placeholder="Min" className="h-10 text-xs" disabled />
                <Input type="number" placeholder="Max" className="h-10 text-xs" disabled />
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
              <button
                className="flex cursor-not-allowed items-center gap-2 text-sm font-medium text-muted-foreground lg:hidden"
                disabled
              >
                <Filter className="h-4 w-4" /> Lọc & Sắp xếp
              </button>
              <Select
                className="h-10 w-auto min-w-44 border-border bg-white text-sm font-medium"
                disabled
              >
                <option>Mới nhất</option>
                <option>Giá: Thấp đến Cao</option>
                <option>Giá: Cao đến Thấp</option>
              </Select>
            </div>

            {products.length === 0 ? (
              <EmptyState
                title="Chua co san pham nao"
                description="Nhung mon do moi se xuat hien tai day khi cua hang bat dau dang ban."
                className="mt-8"
              />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
