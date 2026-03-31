"use client";

import { useEffect, useState } from "react";
import { Camera, MapPin, Save, Store, Info, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { shopsApi } from "@/lib/api/shops";
import { filesApi } from "@/lib/api/files";
import { Button, Card, CardContent, Input, Label, PageContainer } from "@/components/ui";

export default function SellerSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shop, setShop] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    avatarUrl: "",
  });

  useEffect(() => {
    async function fetchShop() {
      try {
        const res = await shopsApi.getMe();
        if (res.success) {
          setShop(res.data);
          setFormData({
            name: res.data.name || "",
            description: res.data.description || "",
            address: res.data.address || "",
            avatarUrl: res.data.avatarUrl || "",
          });
        }
      } catch (err: any) {
        toast.error("Không thể tải thông tin cửa hàng.");
      } finally {
        setLoading(false);
      }
    }
    fetchShop();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.loading("Đang tải ảnh lên...", { id: "upload" });
      const res = await filesApi.upload(file);
      if (res.success) {
         setFormData(prev => ({ ...prev, avatarUrl: res.data }));
         toast.success("Tải ảnh lên thành công!", { id: "upload" });
      }
    } catch (err: any) {
      toast.error("Lỗi khi tải ảnh lên!", { id: "upload" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await shopsApi.updateMe(formData);
      if (res.success) {
        toast.success("Cập nhật thông tin cửa hàng thành công!");
        setShop(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi cập nhật thông tin.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </PageContainer>
    );
  }

  const currentAvatar = formData.avatarUrl || "/placeholder-shop.png";

  return (
    <PageContainer className="py-10 max-w-4xl">
      <div className="mb-10 space-y-2">
         <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Store className="h-10 w-10 text-primary" /> Cài đặt Cửa hàng
         </h1>
         <p className="text-slate-500 font-medium italic">Tùy chỉnh diện mạo shop của bạn để thu hút khách hàng hơn.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Avatar & Status */}
        <div className="space-y-6">
           <Card className="overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white">
              <CardContent className="p-8 flex flex-col items-center">
                 <div className="relative group mb-6">
                    <div className="h-40 w-40 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100 flex items-center justify-center">
                       {formData.avatarUrl ? (
                         <img src={filesApi.getDownloadUrl(formData.avatarUrl)} alt="Avatar" className="h-full w-full object-cover" />
                       ) : (
                         <Store className="h-16 w-16 text-slate-300" />
                       )}
                    </div>
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-[2rem]">
                       <Camera className="h-8 w-8" />
                       <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                    </label>
                 </div>
                 
                 <div className="text-center space-y-1">
                    <h2 className="text-xl font-black text-slate-800">{shop?.name || "Shop của bạn"}</h2>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                       Trạng thái: {shop?.status}
                    </div>
                 </div>
              </CardContent>
           </Card>

           <div className="rounded-3xl bg-amber-50 border border-amber-100 p-6 flex gap-4">
              <AlertCircle className="h-6 w-6 text-amber-500 shrink-0" />
              <div className="text-xs text-amber-800 font-medium space-y-1">
                 <p className="font-bold uppercase tracking-wider">Lưu ý quan trọng</p>
                 <p>Hình ảnh shop cần rõ ràng, không chứa nội dung phản cảm.</p>
                 <p>Thông tin mô tả trung thực giúp tăng tỉ lệ chốt đơn.</p>
              </div>
           </div>
        </div>

        {/* Right: Main Form */}
        <div className="md:col-span-2 space-y-6">
           <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden">
              <CardContent className="p-10 space-y-8">
                 <div className="space-y-6">
                    <div className="space-y-3">
                       <Label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                          <Info className="h-4 w-4" /> Tên Cửa hàng
                       </Label>
                       <Input 
                         value={formData.name}
                         onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                         className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold text-slate-800 focus:scale-[1.01] transition-transform"
                         placeholder="Nhập tên shop của bạn..."
                       />
                    </div>

                    <div className="space-y-3">
                       <Label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                          <Info className="h-4 w-4" /> Mô tả ngắn
                       </Label>
                       <textarea 
                         value={formData.description}
                         onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                         className="w-full min-h-[120px] p-4 rounded-2xl border border-slate-100 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:scale-[1.01] transition-all"
                         placeholder="Giới thiệu về shop của bạn..."
                       />
                    </div>

                    <div className="space-y-3">
                       <Label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                          <MapPin className="h-4 w-4" /> Địa chỉ lấy hàng
                       </Label>
                       <Input 
                         value={formData.address}
                         onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                         className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold text-slate-800 focus:scale-[1.01] transition-transform"
                         placeholder="Số nhà, đường, phường, quận..."
                       />
                    </div>
                 </div>

                 <div className="pt-6 border-t border-slate-50">
                    <Button 
                      type="submit" 
                      disabled={saving}
                      className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-3"
                    >
                       {saving ? "Đang lưu..." : (
                         <>
                           <Save className="h-5 w-5" /> Lưu thay đổi
                         </>
                       )}
                    </Button>
                 </div>
              </CardContent>
           </Card>
        </div>
      </form>
    </PageContainer>
  );
}
