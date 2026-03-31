"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, X, ImagePlus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { sellerProductsApi } from "@/lib/api/seller-products";
import { categoriesApi } from "@/lib/api/categories";
import { filesApi } from "@/lib/api/files";
import type { CategoryResponse, ProductResponse } from "@/types";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State hình ảnh
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

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
        const [catRes, prodRes] = await Promise.all([
          categoriesApi.getAll(),
          sellerProductsApi.getAll(), 
        ]);

        if (catRes.success) setCategories(catRes.data);
        
        if (prodRes.success) {
          const product = prodRes.data.find(p => p.id === parseInt(productId));
          if (product) {
            setFormData({
              name: product.name,
              description: product.description,
              price: product.price.toString(),
              stock: (product.stock ?? 0).toString(),
              categoryId: product.categoryId.toString(),
              condition: product.condition,
              status: product.status,
            });
            setExistingImages(product.imageUrls || []);
          } else {
            toast.error("Không tìm thấy sản phẩm.");
            router.push("/seller/products");
          }
        }
      } catch (err: any) {
        toast.error("Lỗi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    }
    if (productId) fetchData();
  }, [productId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + existingImages.length + newFiles.length > 5) {
      toast.error("Tối đa 5 ảnh sản phẩm.");
      return;
    }
    setNewFiles([...newFiles, ...files]);
    const previews = files.map(f => URL.createObjectURL(f));
    setNewPreviews([...newPreviews, ...previews]);
  };

  const removeExistingImage = (index: number) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const removeNewImage = (index: number) => {
    const updatedFiles = [...newFiles];
    updatedFiles.splice(index, 1);
    setNewFiles(updatedFiles);

    const updatedPreviews = [...newPreviews];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setNewPreviews(updatedPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId || !formData.stock) {
      toast.error("Vui lòng điền đủ thông tin!");
      return;
    }

    if (existingImages.length + newFiles.length === 0) {
      toast.error("Sản phẩm phải có ít nhất 1 ảnh.");
      return;
    }
    
    try {
      setSaving(true);
      
      let finalImageUrls = [...existingImages];
      
      // Upload new images if any
      if (newFiles.length > 0) {
        const uploadRes = await filesApi.uploadMultiple(newFiles);
        if (uploadRes.success) {
          finalImageUrls = [...finalImageUrls, ...uploadRes.data];
        }
      }

      const res = await sellerProductsApi.update(parseInt(productId), {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId),
        condition: formData.condition,
        status: formData.status,
        imageUrls: finalImageUrls,
      });
      
      if (res.success) {
        toast.success("Cập nhật thành công!");
        router.push("/seller/products");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi cập nhật.");
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
            Mã sản phẩm: #{productId}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Gallery Management */}
        <div className="rounded-xl border bg-white shadow-sm p-6 space-y-6">
           <h2 className="text-lg font-semibold border-b pb-2 mb-4 text-orange-600">Hình ảnh sản phẩm</h2>
           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* Existing Images */}
              {existingImages.map((url, index) => (
                <div key={`exist-${index}`} className="relative aspect-square rounded-lg border overflow-hidden group">
                  <img src={filesApi.getDownloadUrl(url.split('/').pop() || '')} alt="Product" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-orange-600/80 text-white text-[10px] text-center py-0.5 font-bold italic">Ảnh chính</div>
                  )}
                </div>
              ))}
              
              {/* New Previews */}
              {newPreviews.map((src, index) => (
                <div key={`new-${index}`} className="relative aspect-square rounded-lg border overflow-hidden group ring-2 ring-emerald-500/30">
                  <img src={src} alt="New preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute top-0 left-0 bg-emerald-500 text-white text-[8px] px-1 font-bold">MỚI</div>
                </div>
              ))}

              {existingImages.length + newFiles.length < 5 && (
                <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-slate-200 hover:border-orange-500 hover:bg-orange-50/30 cursor-pointer transition-all">
                  <ImagePlus className="h-8 w-8 text-slate-400 mb-2" />
                  <span className="text-xs font-medium text-slate-500">Thêm ảnh</span>
                  <input type="file" accept="image/*" multiple onChange={handleNewImageChange} className="hidden" />
                </label>
              )}
           </div>
           <p className="text-[11px] text-slate-400">Bạn có thể thay đổi thứ tự bằng cách xóa đi và tải lại ảnh mới. Tối đa 5 ảnh.</p>
        </div>

        <div className="rounded-xl border bg-white shadow-sm p-6 space-y-6">
           <h2 className="text-lg font-semibold border-b pb-2 mb-4 text-orange-600">Thông tin cơ bản</h2>
           <div className="grid gap-6 md:grid-cols-2">
             <div className="space-y-2 col-span-2">
               <label htmlFor="name" className="text-sm font-medium text-slate-700">Tên sản phẩm <span className="text-red-500">*</span></label>
               <input
                 type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                 className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                 required
               />
             </div>

             <div className="space-y-2">
               <label htmlFor="categoryId" className="text-sm font-medium text-slate-700">Danh mục <span className="text-red-500">*</span></label>
               <select
                 id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange}
                 className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
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
                   id="status" name="status" value={formData.status} onChange={handleChange}
                   className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                 >
                   <option value="ACTIVE">⚡ Đang hoạt động / Hiển thị</option>
                   <option value="HIDDEN">🔒 Tạm ẩn / Ngừng kinh doanh</option>
                   <option value="SOLD">❌ Đã bán hết (Tạm thời)</option>
                 </select>
              </div>
           </div>
        </div>

        <div className="rounded-xl border bg-white shadow-sm p-6 space-y-6">
           <h2 className="text-lg font-semibold border-b pb-2 mb-4 text-orange-600">Kho và Giá</h2>
           <div className="grid gap-6 md:grid-cols-2">
             <div className="space-y-2">
               <label htmlFor="price" className="text-sm font-medium text-slate-700">Giá bán (VNĐ) <span className="text-red-500">*</span></label>
               <div className="relative">
                  <input
                    type="number" id="price" name="price" min="1000" step="1000" value={formData.price} onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 pl-12 text-sm font-semibold text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    required
                  />
                  <div className="absolute top-0 bottom-0 left-0 flex items-center px-3 border-r bg-slate-50 text-slate-500 text-sm font-bold rounded-l-md pointer-events-none">₫</div>
               </div>
             </div>

             <div className="space-y-2">
               <label htmlFor="stock" className="text-sm font-medium text-slate-700">Số lượng tồn kho <span className="text-red-500">*</span></label>
               <input
                 type="number" id="stock" name="stock" min="0" value={formData.stock} onChange={handleChange}
                 className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                 required
               />
             </div>
           </div>

           <div className="space-y-2">
             <label htmlFor="description" className="text-sm font-medium text-slate-700">Mô tả sản phẩm <span className="text-red-500">*</span></label>
             <textarea
               id="description" name="description" rows={6} value={formData.description} onChange={handleChange}
               className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 resize-y"
               required
             />
           </div>
        </div>
        
        <div className="flex justify-end gap-4 mt-8">
           <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-lg font-medium text-slate-600 bg-white border hover:bg-slate-50 transition-colors">Hủy bỏ</button>
           <button type="submit" disabled={saving} className="flex items-center gap-2 px-8 py-2.5 rounded-lg font-semibold text-white bg-orange-600 hover:bg-orange-700 shadow-sm transition-all disabled:opacity-50">
              {saving ? <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"/> : <Save className="h-4 w-4" />}
               Lưu các thay đổi
           </button>
        </div>
      </form>
    </div>
  );
}
