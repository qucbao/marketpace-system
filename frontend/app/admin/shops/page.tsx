"use client";

import { useEffect, useState } from "react";
import { Check, Mail, Package, Store, X, Info, LayoutGrid, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

import { shopsApi } from "@/lib/api/shops";
import { filesApi } from "@/lib/api/files";
import type { ShopResponse } from "@/types";
import { Badge, Button, Card, CardContent, PageContainer, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";

export default function AdminShopsPage() {
  const [pendingShops, setPendingShops] = useState<ShopResponse[]>([]);
  const [allShops, setAllShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  async function fetchData() {
    try {
      setLoading(true);
      const [pendingRes, allRes] = await Promise.all([
        shopsApi.getPending(),
        shopsApi.getAllDetail()
      ]);
      
      if (pendingRes.success) setPendingShops(pendingRes.data);
      if (allRes.success) setAllShops(allRes.data);
    } catch (err: any) {
      toast.error(err.message || "Không thể tải dữ liệu cửa hàng.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (shop: ShopResponse) => {
    try {
      if (confirm(`Duyệt shop "${shop.name}"?`)) {
        const res = await shopsApi.approve(shop.id);
        if (res.success) {
          toast.success("Duyệt shop thành công!");
          fetchData();
        }
      }
    } catch (err: any) {
      toast.error("Lỗi khi duyệt!");
    }
  };

  const handleReject = async (shop: ShopResponse) => {
    try {
      if (confirm(`Từ chối shop "${shop.name}"?`)) {
        const res = await shopsApi.reject(shop.id);
        if (res.success) {
          toast.success("Đã từ chối!");
          fetchData();
        }
      }
    } catch (err: any) {
      toast.error("Lỗi!");
    }
  };

  return (
    <PageContainer className="py-10">
      <div className="mb-10 space-y-2">
         <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Store className="h-10 w-10 text-primary" /> Quản lý hệ thống Cửa hàng
         </h1>
         <p className="text-slate-500 font-medium italic">Theo dõi, kiểm duyệt và quản lý các đơn vị kinh doanh trên sàn.</p>
      </div>

      <Tabs defaultValue="pending" onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-slate-100 p-1.5 rounded-2xl h-14 border-none shadow-inner">
          <TabsTrigger value="pending" className="rounded-xl px-8 font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all">
            Chờ duyệt ({pendingShops.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="rounded-xl px-8 font-black text-xs uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all">
            Tất cả cửa hàng ({allShops.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden min-h-[400px]">
             <CardContent className="p-0">
                {loading ? (
                  <div className="p-20 text-center"><div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto" /></div>
                ) : pendingShops.length === 0 ? (
                  <div className="p-20 text-center opacity-40"><Store className="h-16 w-16 mx-auto mb-4" /><p className="font-bold uppercase tracking-widest">Không còn shop chờ duyệt</p></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                       <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b">
                          <tr>
                             <th className="px-8 py-6">Tên Shop & Mô tả</th>
                             <th className="px-8 py-6">Chủ sở hữu</th>
                             <th className="px-8 py-6 text-center">Thao tác</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {pendingShops.map((shop) => (
                             <tr key={shop.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6">
                                   <div className="flex items-center gap-4">
                                      <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                         <Store className="h-6 w-6 text-slate-400" />
                                      </div>
                                      <div className="space-y-1">
                                         <p className="font-black text-slate-800 leading-none">{shop.name}</p>
                                         <p className="text-xs text-slate-400 line-clamp-1 italic">{shop.description}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-6">
                                   <div className="flex flex-col">
                                      <p className="font-bold text-slate-700">{shop.ownerName}</p>
                                      <p className="text-[10px] text-slate-400">ID: #{shop.ownerId}</p>
                                   </div>
                                </td>
                                <td className="px-8 py-6">
                                   <div className="flex justify-center gap-2">
                                      <Button onClick={() => handleApprove(shop)} className="h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[10px] tracking-widest px-6 shadow-lg shadow-emerald-500/20"><Check className="h-3 w-3 mr-2" /> Duyệt</Button>
                                      <Button onClick={() => handleReject(shop)} variant="ghost" className="h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-black uppercase text-[10px] tracking-widest px-6"><X className="h-3 w-3 mr-2" /> Từ chối</Button>
                                   </div>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
                )}
             </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white overflow-hidden min-h-[400px]">
             <CardContent className="p-0">
                {loading ? (
                  <div className="p-20 text-center"><div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto" /></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                       <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b">
                          <tr>
                             <th className="px-8 py-6">Cửa hàng</th>
                             <th className="px-8 py-6">Thông tin liên hệ</th>
                             <th className="px-8 py-6">Địa chỉ & SP</th>
                             <th className="px-8 py-6">Trạng thái</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {allShops.map((shop) => (
                             <tr key={shop.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6">
                                   <div className="flex items-center gap-4">
                                      <div className="h-12 w-12 rounded-[1rem] overflow-hidden bg-slate-100 flex items-center justify-center shrink-0 border border-slate-50 shadow-sm">
                                         {shop.avatarUrl ? (
                                           <img src={filesApi.getDownloadUrl(shop.avatarUrl)} className="h-full w-full object-cover" />
                                         ) : (
                                           <Store className="h-6 w-6 text-slate-300" />
                                         )}
                                      </div>
                                      <div>
                                         <p className="font-black text-slate-800 leading-none">{shop.name}</p>
                                         <p className="text-[10px] text-slate-400 italic mt-1.5">Mở: {new Date(shop.createdAt).toLocaleDateString()}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-6 space-y-1.5">
                                   <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                      <Info className="h-3 w-3 text-primary" /> {shop.ownerName}
                                   </div>
                                   <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 lowercase">
                                      <Mail className="h-3 w-3" /> {shop.ownerEmail || "N/A"}
                                   </div>
                                </td>
                                <td className="px-8 py-6 space-y-1.5">
                                   <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                      <MapPin className="h-3 w-3 text-primary/50" /> {shop.address || "Chưa cập nhật"}
                                   </div>
                                   <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                                      <Package className="h-3.5 w-3.5 text-primary" /> {shop.totalProducts || 0} sản phẩm
                                   </div>
                                </td>
                                <td className="px-8 py-6">
                                   <Badge 
                                     variant={shop.status === "APPROVED" ? "accent" : shop.status === "PENDING" ? "neutral" : "outline"}
                                     className="font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-lg border-none shadow-sm"
                                   >
                                      {shop.status}
                                   </Badge>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                  </div>
                )}
             </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
