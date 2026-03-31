import { Filter, SlidersHorizontal, Sparkles } from "lucide-react";

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
import { cn } from "@/lib/utils";

export default async function ProductsPage() {
  const products = (await productsApi.getAll()).data || [];
  const categories = (await categoriesApi.getAll()).data || [];

  return (
    <AppShell>
      <PageContainer className="py-10">
        <div className="relative mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
           <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-tighter text-sm">
                 <Sparkles className="h-4 w-4" /> Khám phá xu hướng
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">KHO ĐỒ CŨ GIÁ HỜI</h1>
              <p className="text-slate-500 font-medium max-w-md italic">Săn lùng những báu vật được thanh lý từ cộng đồng với chất lượng được kiểm định.</p>
           </div>
           <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-slate-200">
              {products.length} SẢN PHẨM HIỆN CÓ
           </div>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Sidebar Filters */}
          <aside className="hidden w-72 shrink-0 space-y-8 lg:block">
            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="mb-6">
                <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 border-b pb-4">
                  <Filter className="h-4 w-4 text-primary" /> Lọc theo Danh mục
                </h3>
                <div className="space-y-4">
                  {categories.map((cat) => (
                    <label 
                      key={cat.id} 
                      className="group flex items-center justify-between cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                         <div className="h-5 w-5 border-2 border-slate-200 rounded-md transition-all group-hover:border-primary" />
                         <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{cat.name}</span>
                      </div>
                      <Badge variant="neutral" className="text-[10px] scale-90">Soon</Badge>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50">
                <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                  <SlidersHorizontal className="h-4 w-4 text-primary" /> Khoảng giá
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-slate-400 ml-1">TỪ</p>
                       <Input type="number" placeholder="0đ" className="h-11 rounded-xl text-sm border-slate-100 focus:border-primary transition-all" />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-slate-400 ml-1">ĐẾN</p>
                       <Input type="number" placeholder="Max" className="h-11 rounded-xl text-sm border-slate-100 focus:border-primary transition-all" />
                    </div>
                  </div>
                  <button className="w-full h-11 bg-slate-50 rounded-xl text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-colors">
                     Áp dụng lọc
                  </button>
                </div>
              </div>
            </div>
            
            <div className="rounded-3xl bg-gradient-to-br from-primary to-blue-600 p-8 text-white shadow-xl shadow-primary/20">
               <h4 className="font-black text-lg leading-tight mb-2">Đăng bán đồ cũ của bạn?</h4>
               <p className="text-xs font-medium opacity-80 mb-6">Tạo Shop và bắt đầu kiếm tiền từ những món đồ bạn không dùng tới.</p>
               <button className="w-full h-11 bg-white text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform">
                  Mở shop ngay
               </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8 flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-50 shadow-sm">
              <button
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 lg:hidden"
              >
                <Filter className="h-4 w-4" /> BỘ LỌC
              </button>
              <div className="flex items-center gap-4">
                 <span className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-widest">Sắp xếp theo</span>
                 <Select
                   className="h-11 w-auto min-w-56 border-slate-100 bg-slate-50 text-sm font-bold rounded-xl"
                 >
                   <option>Mới nhất hiện nay</option>
                   <option>Giá: Thấp đến Cao</option>
                   <option>Giá: Cao đến Thấp</option>
                   <option>Đang hot nhất</option>
                 </Select>
              </div>
            </div>

            {products.length === 0 ? (
              <EmptyState
                title="Sàn đấu đang trống..."
                description="Những món đồ báu vật sẽ sớm xuất hiện tại đây. Hãy quay lại sau nhé!"
                className="mt-12 bg-slate-50 rounded-[2.5rem] py-20"
              />
            ) : (
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
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

