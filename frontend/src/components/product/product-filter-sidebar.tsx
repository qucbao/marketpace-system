"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { Badge, Input } from "@/components/ui";
import type { CategoryResponse } from "@/types";
import { cn } from "@/lib/utils";

interface ProductFilterSidebarProps {
  categories: CategoryResponse[];
}

export function ProductFilterSidebar({ categories }: ProductFilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL State
  const currentCategoryId = searchParams.get("categoryId");
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";

  // Local State for price inputs
  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);

  useEffect(() => {
    setMinPrice(currentMinPrice);
    setMaxPrice(currentMaxPrice);
  }, [currentMinPrice, currentMaxPrice]);

  const updateParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCategoryToggle = (id: number) => {
    const newId = currentCategoryId === id.toString() ? null : id.toString();
    updateParams({ categoryId: newId });
  };

  const handleApplyPrice = () => {
    updateParams({ 
      minPrice: minPrice || null, 
      maxPrice: maxPrice || null 
    });
  };

  const handleClearAll = () => {
    router.push(pathname);
    setMinPrice("");
    setMaxPrice("");
  };

  const hasAnyFilter = currentCategoryId || currentMinPrice || currentMaxPrice || searchParams.get("query");

  return (
    <aside className="hidden w-72 shrink-0 space-y-8 lg:block">
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
             <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
               <Filter className="h-4 w-4 text-primary" /> Lọc theo Danh mục
             </h3>
             {hasAnyFilter && (
               <button 
                 onClick={handleClearAll}
                 className="text-[10px] font-black text-primary uppercase hover:underline"
               >
                 Xóa hết
               </button>
             )}
          </div>
          
          <div className="space-y-2">
            {categories.map((cat) => {
              const isActive = currentCategoryId === cat.id.toString();
              return (
                <button 
                  key={cat.id} 
                  onClick={() => handleCategoryToggle(cat.id)}
                  className={cn(
                    "group flex w-full items-center justify-between cursor-pointer p-2.5 rounded-xl transition-all",
                    isActive ? "bg-primary/5 text-primary" : "hover:bg-slate-50 text-slate-600"
                  )}
                >
                  <div className="flex items-center gap-3">
                     <div className={cn(
                       "h-5 w-5 border-2 rounded-md transition-all flex items-center justify-center",
                       isActive ? "border-primary bg-primary text-white" : "border-slate-200 group-hover:border-primary bg-white"
                     )}>
                       {isActive && <div className="h-1.5 w-1.5 rounded-full bg-white animate-in zoom-in" />}
                     </div>
                     <span className={cn(
                       "text-sm font-bold transition-colors",
                       isActive ? "text-primary" : "group-hover:text-slate-900"
                     )}>{cat.name}</span>
                  </div>
                  {isActive && <X className="h-3 w-3 opacity-50" />}
                </button>
              );
            })}
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
                 <Input 
                   type="number" 
                   placeholder="0đ" 
                   value={minPrice}
                   onChange={(e) => setMinPrice(e.target.value)}
                   className="h-11 rounded-xl text-sm border-slate-100 focus:border-primary transition-all pr-2" 
                 />
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-bold text-slate-400 ml-1">ĐẾN</p>
                 <Input 
                   type="number" 
                   placeholder="Max" 
                   value={maxPrice}
                   onChange={(e) => setMaxPrice(e.target.value)}
                   className="h-11 rounded-xl text-sm border-slate-100 focus:border-primary transition-all pr-2" 
                 />
              </div>
            </div>
            <button 
              onClick={handleApplyPrice}
              className={cn(
                "w-full h-11 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm",
                (minPrice !== currentMinPrice || maxPrice !== currentMaxPrice)
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-slate-50 text-slate-400 hover:bg-slate-100"
              )}
            >
               Áp dụng lọc
            </button>
          </div>
        </div>
      </div>
      
      <div className="rounded-3xl bg-gradient-to-br from-primary to-blue-600 p-8 text-white shadow-xl shadow-primary/20 group overflow-hidden relative">
         <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500" />
         <h4 className="font-black text-lg leading-tight mb-2 relative z-10">Đăng bán đồ cũ của bạn?</h4>
         <p className="text-xs font-medium opacity-80 mb-6 relative z-10">Tạo Shop và bắt đầu kiếm tiền từ những món đồ bạn không dùng tới.</p>
         <button className="w-full h-11 bg-white text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform relative z-10 shadow-lg">
            Mở shop ngay
         </button>
      </div>
    </aside>
  );
}
