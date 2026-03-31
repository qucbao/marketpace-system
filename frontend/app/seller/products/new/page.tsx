"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, X, ImagePlus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { sellerProductsApi } from "@/lib/api/seller-products";
import { categoriesApi } from "@/lib/api/categories";
import { filesApi } from "@/lib/api/files";
import type { CategoryResponse } from "@/types";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State cho hình ảnh
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "1",
    categoryId: "",
    condition: "NEW", 
  });

  useEffect(() => {
    categoriesApi.getAll().then(res => {
       if (res.success) setCategories(res.data);
    }).catch(() => {
       toast.error("Không tải được Danh mục");
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 5) {
      toast.error("Tối đa chỉ được tải lên 5 ảnh.");
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId || !formData.stock) {
      toast.error("Vui lòng điền đủ thông tin bắt buộc!");
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error("Vui lòng tải lên ít nhất 1 hình ảnh sản phẩm.");
      return;
    }
    
    try {
      setLoading(true);
      setIsUploading(true);
      
      // 1. Upload all images first
      const uploadRes = await filesApi.uploadMultiple(selectedFiles);
      if (!uploadRes.success) {
        throw new Error("Lỗi khi tải ảnh lên server.");
      }
      
      const imageUrls = uploadRes.data;
      
      // 2. Create product with image URLs
      const res = await sellerProductsApi.create({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        categoryId: parseInt(formData.categoryId),
        condition: formData.condition,
        imageUrls: imageUrls,
      });
      
      if (res.success) {
        toast.success("Đăng bán sản phẩm thành công!");
        router.push("/seller/products");
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi hệ thống khi đăng sản phẩm.");
    } finally {
      setLoading(false);
      setIsUploading(false);
    }
  };

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
            Thêm sản phẩm mới
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-slate-500">
            Cung cấp thông tin chi tiết giúp khách hàng dễ dàng tin tưởng hơn.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Phần Hình ảnh */}
        <div className="rounded-xl border bg-white shadow-sm p-6 space-y-6">
           <h2 className="text-lg font-semibold border-b pb-2 mb-4 text-orange-600">Hình ảnh sản phẩm</h2>
           
           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {previews.map((src, index) => (
                <div key={index} className="relative aspect-square rounded-lg border overflow-hidden group bg-slate-50">
                  <img src={src} alt={`Preview ${index}`} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-orange-600/80 text-white text-[10px] text-center py-0.5 font-bold">Ảnh chính</div>
                  )}
                </div>
              ))}
              
              {selectedFiles.length < 5 && (
                <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-slate-200 hover:border-orange-500 hover:bg-orange-50/30 cursor-pointer transition-all">
                  <ImagePlus className="h-8 w-8 text-slate-400 mb-2" />
                  <span className="text-xs font-medium text-slate-500">Thêm ảnh</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                </label>
              )}
           </div>
           <p className="text-[11px] text-slate-400">Tối đa 5 ảnh. Ảnh đầu tiên sẽ làm ảnh đại diện hiển thị ngoài trang chủ.</p>
        </div>

        <div className="rounded-xl border bg-white shadow-sm p-6 space-y-6">
           <h2 className="text-lg font-semibold border-b pb-2 mb-4 text-orange-600">Thông tin cơ bản</h2>
           
           <div className="grid gap-6 md:grid-cols-2">
             <div className="space-y-2 col-span-2">
               <label htmlFor="name" className="text-sm font-medium text-slate-700">
                 Tên sản phẩm <span className="text-red-500">*</span>
               </label>
               <input
                 type="text"
                 id="name"
                 name="name"
                 value={formData.name}
                 onChange={handleChange}
                 placeholder="Nhập tên sản phẩm (VD: Áo thun nam dệt kim)"
                 className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                 required
               />
             </div>

             <div className="space-y-2">
               <label htmlFor="categoryId" className="text-sm font-medium text-slate-700">
                 Danh mục hàng hóa <span className="text-red-500">*</span>
               </label>
               <select
                 id="categoryId"
                 name="categoryId"
                 value={formData.categoryId}
                 onChange={handleChange}
                 className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                 required
               >
                 <option value="" disabled>--- Chọn danh mục ---</option>
                 {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                 ))}
               </select>
             </div>
             
             <div className="space-y-2">
               <label htmlFor="condition" className="text-sm font-medium text-slate-700">
                 Tình trạng <span className="text-red-500">*</span>
               </label>
               <select
                 id="condition"
                 name="condition"
                 value={formData.condition}
                 onChange={handleChange}
                 className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
               >
                 <option value="NEW">Mới (Fullbox, Nguyên Seal)</option>
                 <option value="USED_LIKE_NEW">Cũ (Like New 99%)</option>
                 <option value="USED">Cũ (Đã qua sử dụng)</option>
               </select>
             </div>
           </div>
        </div>

        <div className="rounded-xl border bg-white shadow-sm p-6 space-y-6">
           <h2 className="text-lg font-semibold border-b pb-2 mb-4 text-orange-600">Chi tiết & Giá cả</h2>
           
           <div className="space-y-4">
             <div className="space-y-2">
               <label htmlFor="price" className="text-sm font-medium text-slate-700">
                 Giá bán (VNĐ) <span className="text-red-500">*</span>
               </label>
               <div className="relative">
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="1000"
                    step="1000"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="VD: 150000"
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 pl-12 text-sm font-semibold text-orange-600 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    required
                  />
                  <div className="absolute top-0 bottom-0 left-0 flex items-center px-3 border-r bg-slate-50 text-slate-500 text-sm font-bold rounded-l-md pointer-events-none">
                     ₫
                  </div>
               </div>
             </div>

             <div className="space-y-2">
               <label htmlFor="stock" className="text-sm font-medium text-slate-700">
                 Số lượng tồn kho <span className="text-red-500">*</span>
               </label>
               <input
                 type="number"
                 id="stock"
                 name="stock"
                 min="1"
                 value={formData.stock}
                 onChange={handleChange}
                 placeholder="Số lượng sản phẩm sẵn có"
                 className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                 required
               />
             </div>

             <div className="space-y-2">
               <label htmlFor="description" className="text-sm font-medium text-slate-700">
                 Mô tả sản phẩm <span className="text-red-500">*</span>
               </label>
               <textarea
                 id="description"
                 name="description"
                 rows={6}
                 value={formData.description}
                 onChange={handleChange}
                 placeholder="Mô tả kỹ nội dung, kích thước, cấu hình, xuất xứ..."
                 className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 resize-y"
                 required
               />
             </div>
           </div>
        </div>
        
        <div className="flex justify-end gap-4 mt-8">
           <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 rounded-lg font-medium text-slate-600 bg-white border hover:bg-slate-50 transition-colors"
           >
              Hủy bỏ
           </button>
           <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-2.5 rounded-lg font-semibold text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:ring-orange-200 transition-all disabled:opacity-50 shadow-sm"
           >
              {loading ? (
                <div className="flex items-center gap-2">
                   <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"/>
                   <span>{isUploading ? "Đang tải ảnh..." : "Đang lưu..."}</span>
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Lưu & Đăng bán</span>
                </>
              )}
           </button>
        </div>
      </form>
    </div>
  );
}
