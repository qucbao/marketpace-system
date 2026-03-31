import { Filter, Search, Sparkles, X } from "lucide-react";
import Link from "next/link";

import { ProductCard } from "@/components/product/product-card";
import { ProductFilterSidebar } from "@/components/product/product-filter-sidebar";
import { ProductSortSelect } from "@/components/product/product-sort-select";
import {
  AppShell,
  EmptyState,
  PageContainer,
} from "@/components/ui";
import { categoriesApi, productsApi } from "@/lib/api";

interface ProductsPageProps {
  searchParams: Promise<{
    query?: string;
    categoryId?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  
  const [productsRes, categoriesRes] = await Promise.all([
    productsApi.getAll({
      query: params.query,
      categoryId: params.categoryId ? parseInt(params.categoryId) : undefined,
      minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
      sort: params.sort,
    }),
    categoriesApi.getAll(),
  ]);

  const products = productsRes.data || [];
  const categories = categoriesRes.data || [];

  const isFiltered = params.query || params.categoryId || params.minPrice || params.maxPrice || params.sort;

  return (
    <AppShell>
      <PageContainer className="py-10">
        <div className="relative mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
           <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-tighter text-sm">
                 <Sparkles className="h-4 w-4" /> Khám phá xu hướng
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                {params.query ? `KẾT QUẢ CHO: "${params.query}"` : "KHO ĐỒ CŨ GIÁ HỜI"}
              </h1>
              <p className="text-slate-500 font-medium max-w-md italic">
                {params.query 
                  ? `Tìm thấy ${products.length} báu vật phù hợp với từ khóa của bạn.`
                  : "Săn lùng những báu vật được thanh lý từ cộng đồng với chất lượng được kiểm định."
                }
              </p>
           </div>
           <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-slate-200 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {products.length} SẢN PHẨM HIỆN CÓ
           </div>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Sidebar */}
          <ProductFilterSidebar categories={categories} />

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8 flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-50 shadow-sm transition-all hover:shadow-md">
              <button
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 lg:hidden hover:text-primary transition-colors"
                aria-label="Mở bộ lọc"
              >
                <Filter className="h-4 w-4" /> BỘ LỌC
              </button>
              
              <ProductSortSelect />
            </div>

            {/* Active Filters Summary (Optional) */}
            {params.query && (
              <div className="mb-6 flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                  <Search className="h-3 w-3" />
                  Tìm: {params.query}
                  <Link href="/products" className="ml-1 hover:text-primary/70">
                    <X className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}

            {products.length === 0 ? (
              <div className="space-y-6">
                <EmptyState
                  title={isFiltered ? "Không tìm thấy báu vật nào..." : "Sàn đấu đang trống..."}
                  description={isFiltered 
                    ? "Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để khám phá thêm nhiều món đồ thú vị khác."
                    : "Những món đồ báu vật sẽ sớm xuất hiện tại đây. Hãy quay lại sau nhé!"
                  }
                  className="mt-4 bg-slate-50 rounded-[2.5rem] py-20 border-2 border-dashed border-slate-100"
                />
                {isFiltered && (
                   <div className="text-center">
                      <Link 
                        href="/products" 
                        className="text-xs font-black text-primary uppercase tracking-widest hover:underline"
                      >
                        Thiết lập lại tất cả bộ lọc
                      </Link>
                   </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 animate-in fade-in duration-700">
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


