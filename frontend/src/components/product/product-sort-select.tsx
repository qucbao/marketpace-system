"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select } from "@/components/ui";

export function ProductSortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "newest";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = e.target.value;
    
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-4">
      <span className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-widest">Sắp xếp theo</span>
      <Select
        value={currentSort}
        onChange={handleSortChange}
        className="h-11 w-auto min-w-56 border-slate-100 bg-slate-50 text-sm font-bold rounded-xl focus:border-primary focus:ring-primary/10 transition-all"
      >
        <option value="newest">Mới nhất hiện nay</option>
        <option value="price_asc">Giá: Thấp đến Cao</option>
        <option value="price_desc">Giá: Cao đến Thấp</option>
        <option value="hot">Đang hot nhất</option>
      </Select>
    </div>
  );
}
