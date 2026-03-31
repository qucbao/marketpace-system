"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { sellerProductsApi } from "@/lib/api/seller-products";
import { categoriesApi } from "@/lib/api/categories";
import type { CategoryResponse, ProductResponse } from "@/types";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    condition: "NEW",
    status: "ACTIVE" as "ACTIVE" | "HIDDEN" | "SOLD",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Load categories and product data in parallel
        const [catRes, prodRes] = await Promise.all([
          categoriesApi.getAll(),
          sellerProductsApi.getAll(), // We don't have getById for seller yet, filtering from list
        ]);

        if (catRes.success) setCategories(catRes.data);
        
        if (prodRes.success) {
          const product = prodRes.data.find(p => p.id === parseInt(productId));
          if (product) {
            setFormData({
              name: product.name,
              description: product.description,
              price: product.price.toString(),
              stock: product.stock.toString(),
              categoryId: product.categoryId.toString(),
              condition: product.condition,
              status: product.status,
            });
          } else {
            toast.error("Không tìm thấy sản phẩm hoặc bạn không có quyền sửa.");
            router.push("/seller/products");
          }
        }
      } catch (err: any) {
        toast.error("Lỗi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [productId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId || !formData.stock) {
      toast.error("Vui lòng điền đủ thông tin!");
      return;
    }
    
    try {
      setSaving(true);
      const res = await sellerProductsApi.update(parseInt(productId), {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId),
        condition: formData.condition,
        status: formData.status,
      });
      
      if (res.success) {
        toast.success("Cập nhật sản phẩm thành công!");
        router.push("/seller/products");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi cập nhật sản phẩm.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
     return (
       <div className="flex min-h-[400px] items-center justify-center">
         <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
       </div>
     );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4 border-b pb-4">
        <Link
          href="/seller/products"
          className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Chỉnh sửa sản phẩm
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            ID: #{productId}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="rounded-xl border bg-white shadow-sm p-6 space-y-6">
           <h2 className="text-lg font-semibold border-b pb-2 mb-4">Thông tin cơ bản</h2>
           <div className="grid gap-6 md:grid-cols-2">
             <div className="space-y-2 col-span-2">
               <label htmlFor="name" className="text-sm font-medium text-slate-700">Tên sản phẩm</label>
               <input
                 type="text"
                 id="name"
                 name="name"
                 value={formData.name}
                 onChange={handleChange}
                 className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                 required
               />
             </div>

             <div className="space-y-2">
               <label htmlFor="categoryId" className="text-sm font-medium text-slate-700">Danh mục</label>
               <select
                 id="categoryId"
                 name="categoryId"
                 value={formData.categoryId}
                 onChange={handleChange}
                 className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                 required
               >
                 {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                 ))}
               </select>
             </div>
             
             <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium text-slate-700">Trạng thái hiển thị</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  <option value="ACTIVE">⚡ Đang hoạt động / Hiển thị</option>
                  <option value="HIDDEN">🔒 Tạm ẩn / Ngừng kinh doanh</option>
                  <option value="SOLD">❌ Đã bán hết (Tạm thời)</option>
                </select>
             </div>
           </div>
        </div>

        <div className="rounded-xl border bg-white shadow-sm p-6 space-y-6">
           <h2 className="text-lg font-semibold border-b pb-2 mb-4">Kho và Giá</h2>
           <div className="grid gap-6 md:grid-cols-2">
             <div className="space-y-2">
               <label htmlFor="price" className="text-sm font-medium text-slate-700">Giá bán (VNĐ)</label>
               <div className="relative">
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="1000"
                    step="1000"
                    value={formData.price}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 pl-12 text-sm font-semibold text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    required
                  />
                  <div className="absolute top-0 bottom-0 left-0 flex items-center px-3 border-r bg-slate-50 text-slate-500 text-sm font-bold rounded-l-md pointer-events-none">₫</div>
               </div>
             </div>

             <div className="space-y-2">
               <label htmlFor="stock" className="text-sm font-medium text-slate-700">Tồn kho</label>
               <input
                 type="number"
                 id="stock"
                 name="stock"
                 min="0"
                 value={formData.stock}
                 onChange={handleChange}
                 className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                 required
               />
             </div>
           </div>

           <div className="space-y-2">
             <label htmlFor="description" className="text-sm font-medium text-slate-700">Mô tả sản phẩm</label>
             <textarea
               id="description"
               name="description"
               rows={6}
               value={formData.description}
               onChange={handleChange}
               className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 resize-y"
               required
             />
           </div>
        </div>
        
        <div className="flex justify-end gap-4 mt-8">
           <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-lg font-medium text-slate-600 bg-white border hover:bg-slate-50 transition-colors">Hủy</button>
           <button type="submit" disabled={saving} className="flex items-center gap-2 px-8 py-2.5 rounded-lg font-semibold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 shadow-sm transition-all">
              {saving ? <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"/> : <Save className="h-4 w-4" />}
               Cập nhật thông tin
           </button>
        </div>
      </form>
    </div>
  );
}
