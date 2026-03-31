"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X, Search, Tags } from "lucide-react";
import { toast } from "sonner";

import { categoriesApi } from "@/lib/api/categories";
import type { CategoryResponse } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State cho việc thêm mới
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  
  // State cho việc chỉnh sửa
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await categoriesApi.getAll();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await categoriesApi.create(newCategoryName.trim());
      if (res.success) {
        toast.success("Đã thêm danh mục mới");
        setNewCategoryName("");
        setIsAdding(false);
        loadCategories();
      }
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi thêm danh mục");
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;
    try {
      const res = await categoriesApi.update(id, editName.trim());
      if (res.success) {
        toast.success("Đã cập nhật danh mục");
        setEditingId(null);
        loadCategories();
      }
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi cập nhật");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục "${name}"? Các sản phẩm thuộc danh mục này có thể bị ảnh hưởng.`)) {
      try {
        const res = await categoriesApi.delete(id);
        if (res.success) {
          toast.success("Đã xóa danh mục");
          loadCategories();
        }
      } catch (error: any) {
        toast.error(error.message || "Lỗi khi xóa danh mục");
      }
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý Danh mục</h1>
          <p className="text-sm text-muted-foreground">Quản lý các ngành hàng chính cho toàn bộ sàn REUSE.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Thêm danh mục
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-input bg-transparent pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Tổng số: <span className="font-bold text-slate-900">{categories.length}</span>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden min-h-[400px]">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b">
            <tr>
              <th className="px-6 py-4 w-16">ID</th>
              <th className="px-6 py-4">Tên danh mục</th>
              <th className="px-6 py-4 text-center">Số SP liên quan</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {/* Hàng thêm mới */}
            {isAdding && (
              <tr className="bg-primary/5 animate-in fade-in slide-in-from-top-1 duration-200">
                <td className="px-6 py-4 text-muted-foreground font-mono">NEW</td>
                <td className="px-6 py-4">
                  <input
                    autoFocus
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nhập tên danh mục mới..."
                    className="w-full rounded-md border border-primary/30 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  />
                </td>
                <td className="px-6 py-4 text-center text-slate-400">-</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={handleAdd} className="p-1 px-2.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors text-xs font-bold">Lưu</button>
                    <button onClick={() => {setIsAdding(false); setNewCategoryName("");}} className="p-1 px-2.5 rounded-md bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors text-xs font-bold">Hủy</button>
                  </div>
                </td>
              </tr>
            )}

            {filteredCategories.length === 0 && !loading && !isAdding ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                  <Tags className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p>Không tìm thấy danh mục nào phù hợp.</p>
                </td>
              </tr>
            ) : null}

            {loading && !isAdding ? (
               <tr>
                 <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                 </td>
               </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50/50 bg-white group transition-colors">
                  <td className="px-6 py-4 font-mono text-slate-400">#{category.id}</td>
                  <td className="px-6 py-4">
                    {editingId === category.id ? (
                      <input
                        autoFocus
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full rounded-md border border-primary/30 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        onKeyDown={(e) => e.key === "Enter" && handleUpdate(category.id)}
                      />
                    ) : (
                      <span className="font-semibold text-slate-900 group-hover:text-primary transition-colors">{category.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                     <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">Auto-count (MVP)</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       {editingId === category.id ? (
                         <>
                           <button onClick={() => handleUpdate(category.id)} className="p-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all"><Save className="h-4 w-4" /></button>
                           <button onClick={() => setEditingId(null)} className="p-1.5 rounded-md bg-slate-200 text-slate-600 hover:bg-slate-300 transition-all"><X className="h-4 w-4" /></button>
                         </>
                       ) : (
                         <>
                           <button
                             onClick={() => {setEditingId(category.id); setEditName(category.name);}}
                             className="p-1.5 rounded-md text-slate-400 hover:text-primary hover:bg-primary/10 transition-all"
                             title="Sửa"
                           >
                             <Pencil className="h-4 w-4" />
                           </button>
                           <button
                             onClick={() => handleDelete(category.id, category.name)}
                             className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                             title="Xóa"
                           >
                             <Trash2 className="h-4 w-4" />
                           </button>
                         </>
                       )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
