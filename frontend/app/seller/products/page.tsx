"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, PackageSearch, Star, ShoppingCart, Info } from "lucide-react";
import { toast } from "sonner";
import { productsApi } from "@/lib/api/products";
import { filesApi } from "@/lib/api/files";

import { sellerProductsApi } from "@/lib/api/seller-products";
import type { ProductResponse } from "@/types";

export default function SellerProductsPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    try {
      setLoading(true);
      const res = await sellerProductsApi.getAll();
      if (res.success) {
        setProducts(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Không thể tải sản phẩm.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}"? Thao tác này không thể hoàn tác.`)) {
      try {
        const res = await sellerProductsApi.delete(id);
        if (res.success) {
          toast.success("Đã xóa sản phẩm thành công!");
          setProducts(prev => prev.filter(p => p.id !== id));
        }
      } catch (err: any) {
        toast.error(err.message || "Xóa thất bại!");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Quản lý Sản phẩm
          </h1>
          <p className="text-muted-foreground mt-1">
            Tổng số: <span className="font-semibold text-orange-600">{products.length}</span> sản phẩm đang hoạt động.
          </p>
        </div>
        <Link
          href="/seller/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 hover:bg-orange-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> Đăng bán mới
        </Link>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
           <div className="p-8 text-center text-muted-foreground mt-12">
             <div className="animate-spin h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
             Đang rà soát kho hàng...
           </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col flex-1 items-center justify-center p-12 text-center text-muted-foreground h-full min-h-[300px] bg-slate-50">
             <PackageSearch className="h-16 w-16 text-muted-foreground/30 mb-4" />
             <p className="font-medium text-lg text-slate-600">Gian hàng của bạn đang trống</p>
             <p className="text-sm mt-1 max-w-sm">Hãy đăng bán sản phẩm đầu tiên để khách hàng có thể tìm thấy shop bạn nhé.</p>
             <Link
                href="/seller/products/new"
                className="mt-6 rounded-md bg-orange-100 text-orange-700 hover:bg-orange-200 px-4 py-2 text-sm font-semibold transition-colors"
                >
                Đăng sản phẩm ngay
             </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-foreground">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b">
                <tr>
                  <th scope="col" className="px-6 py-4">Sản phẩm</th>
                  <th scope="col" className="px-6 py-4">Phân loại / Tình trạng</th>
                  <th scope="col" className="px-6 py-4 text-center">Đánh giá / Đã bán</th>
                  <th scope="col" className="px-6 py-4">Giá / Kho</th>
                  <th scope="col" className="px-6 py-4">Trạng thái</th>
                  <th scope="col" className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors bg-white">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden border">
                            {product.imageUrls && product.imageUrls.length > 0 ? (
                               <img 
                                  src={filesApi.getDownloadUrl(product.imageUrls[0].split('/').pop() || '')} 
                                  alt={product.name} 
                                  className="h-full w-full object-cover" 
                               />
                            ) : (
                               <div className="flex h-full w-full items-center justify-center text-slate-300">
                                  <PackageSearch className="h-6 w-6" />
                               </div>
                            )}
                         </div>
                         <div className="min-w-0">
                            <p className="font-bold text-slate-900 line-clamp-1">{product.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">#{product.id}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-xs font-semibold text-slate-600">{product.categoryName}</p>
                       <p className="text-[10px] text-slate-400 mt-0.5">{product.condition === 'NEW' ? 'Mới 100%' : 'Đã qua sử dụng'}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1 text-slate-900 font-black text-xs">
                             <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                             {product.averageRating?.toFixed(1) || "5.0"}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                             <ShoppingCart className="h-2.5 w-2.5 text-primary" />
                             Đã bán {product.soldCount || 0}
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <p className="font-black text-orange-600 text-sm">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                       </p>
                       <p className="text-[10px] text-slate-400 font-medium italic">Kho: {product.stock}</p>
                    </td>
                    <td className="px-6 py-4">
                      {product.status === "ACTIVE" ? (
                         <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 ring-1 ring-inset ring-emerald-600/20 shadow-sm">
                            Đang bán
                         </span>
                      ) : product.status === "SOLD" ? (
                         <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-700 ring-1 ring-inset ring-orange-600/20 shadow-sm">
                            Đã bán hết
                         </span>
                      ) : (
                         <span className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-600 ring-1 ring-inset ring-slate-500/20 shadow-sm">
                            Đã ẩn
                         </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                         <Link
                           href={`/seller/products/${product.id}/edit`}
                           className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                           title="Chỉnh sửa sản phẩm"
                         >
                           <Edit2 className="h-4 w-4" />
                         </Link>
                         <button
                           className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                           title="Xóa vĩnh viễn"
                           onClick={() => handleDelete(product.id, product.name)}
                         >
                           <Trash2 className="h-4 w-4" />
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
