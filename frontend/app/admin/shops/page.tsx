"use client";

import { useEffect, useState } from "react";
import { Check, Store, X } from "lucide-react";

import { shopsApi } from "@/lib/api/shops";
import type { ShopResponse } from "@/types";
import { toast } from "sonner"; // Using sonner for easy toast messages if it exists in Nextjs usually. Ensure ui/toast or sonner is configured.

export default function AdminShopsPage() {
  const [shops, setShops] = useState<ShopResponse[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPendingShops() {
    try {
      setLoading(true);
      const res = await shopsApi.getPending();
      if (res.success) {
        setShops(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Không thể tải danh sách cửa hàng.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPendingShops();
  }, []);

  const handleApprove = async (shop: ShopResponse) => {
    try {
      if (confirm(`Bạn có chắc chắn muốn duyệt shop "${shop.name}" không?`)) {
        const res = await shopsApi.approve(shop.id);
        if (res.success) {
          toast.success(`Đã duyệt shop ${shop.name} thành công!`);
          setShops((prev) => prev.filter((s) => s.id !== shop.id));
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi duyệt cửa hàng!");
    }
  };

  const handleReject = async (shop: ShopResponse) => {
    try {
      if (confirm(`Bạn có quyết định TỪ CHỐI shop "${shop.name}" không? Hành động này không thể hoàn tác.`)) {
        const res = await shopsApi.reject(shop.id);
        if (res.success) {
          toast.success(`Đã từ chối shop ${shop.name} thành công!`);
          setShops((prev) => prev.filter((s) => s.id !== shop.id));
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi từ chối cửa hàng!");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-2 border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <Store className="h-8 w-8 text-primary" />
          Duyệt cửa hàng mới
        </h1>
        <p className="text-muted-foreground">
          Bạn có {shops.length} cửa hàng đang chờ xem xét. Hãy kiểm duyệt kỹ thông tin trước khi chấp thuận.
        </p>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
           <div className="p-8 text-center text-muted-foreground mt-12">
             <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
             Đang tải dữ liệu chờ duyệt...
           </div>
        ) : shops.length === 0 ? (
          <div className="flex flex-col flex-1 items-center justify-center p-12 text-center text-muted-foreground h-full min-h-[300px] bg-slate-50">
             <Store className="h-12 w-12 text-muted-foreground/30 mb-4" />
             <p className="font-medium text-lg text-slate-500">Tuyệt vời! Không còn cửa hàng nào cần duyệt.</p>
             <p className="text-sm mt-1">Hệ thống đã cập nhật.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-foreground">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b">
                <tr>
                  <th scope="col" className="px-6 py-4">Tên Shop</th>
                  <th scope="col" className="px-6 py-4">Mô tả</th>
                  <th scope="col" className="px-6 py-4">Chủ sở hữu</th>
                  <th scope="col" className="px-6 py-4 text-center">Thao tác duyệt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {shops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-slate-50/80 transition-colors bg-white">
                    <td className="px-6 py-4 font-semibold text-slate-900 whitespace-nowrap">
                      {shop.name}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-muted-foreground" title={shop.description}>
                      {shop.description || "N/A"}
                    </td>
                    <td className="px-6 py-4 font-medium text-primary">
                      {shop.ownerName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                         <button
                           className="flex items-center gap-1.5 text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-4 py-2 rounded-lg transition-colors font-semibold text-xs shadow-sm"
                           onClick={() => handleApprove(shop)}
                         >
                           <Check className="h-4 w-4" /> Duyệt
                         </button>
                         <button
                           className="flex items-center gap-1.5 text-red-700 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-lg transition-colors font-semibold text-xs shadow-sm"
                           onClick={() => handleReject(shop)}
                         >
                           <X className="h-4 w-4" /> Từ chối
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
