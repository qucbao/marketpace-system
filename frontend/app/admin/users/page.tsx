"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  UserX, 
  ShieldCheck, 
  Trash2, 
  Eye, 
  Store, 
  ShoppingBag,
  AlertTriangle,
  Lock,
  Calendar,
  Mail,
  User as UserIcon,
  ChevronRight,
  Receipt
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";

import { adminUsersApi, type UserDetailResponse } from "@/lib/api/admin-users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserDetailResponse | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [lockReason, setLockReason] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await adminUsersApi.getAll();
      if (res.success) {
        setUsers(res.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleLock = async () => {
    if (!selectedUser || !lockReason.trim()) return;
    try {
      const res = await adminUsersApi.lock(selectedUser.id, lockReason);
      if (res.success) {
        toast.success(`Đã khóa tài khoản ${selectedUser.fullName}`);
        setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, isLocked: true, lockReason } : u));
        setShowLockModal(false);
        setLockReason("");
      }
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi khóa tài khoản");
    }
  };

  const handleUnlock = async (user: UserDetailResponse) => {
    try {
      const res = await adminUsersApi.unlock(user.id);
      if (res.success) {
        toast.success(`Đã mở khóa tài khoản ${user.fullName}`);
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isLocked: false, lockReason: null } : u));
      }
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi mở khóa tài khoản");
    }
  };

  const handleDelete = async (user: UserDetailResponse) => {
    if (!confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản ${user.fullName}? Hành động này sẽ xóa cả Shop và Sản phẩm liên quan.`)) return;
    try {
      const res = await adminUsersApi.delete(user.id);
      if (res.success) {
        toast.success("Đã xóa người dùng");
        setUsers(prev => prev.filter(u => u.id !== user.id));
      }
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi xóa người dùng");
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            QUẢN LÝ NGƯỜI DÙNG
          </h1>
          <p className="text-muted-foreground mt-1">Duyệt hồ sơ, khóa tài khoản vi phạm hoặc quản lý Seller.</p>
        </div>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên hoặc email..."
            className="pl-10 h-11 border-slate-200 focus:ring-primary shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Người dùng</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày tham gia</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8 h-20 bg-slate-50/50"></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-medium">Không tìm thấy người dùng nào</td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm",
                          u.role === "ADMIN" ? "bg-slate-900" : u.role === "SELLER" ? "bg-orange-500" : "bg-blue-500"
                        )}>
                          {u.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-primary transition-colors cursor-pointer" onClick={() => { setSelectedUser(u); setShowDetail(true); }}>
                            {u.fullName}
                          </p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={cn(
                        "rounded-md font-bold px-2 py-0.5",
                        u.role === "ADMIN" ? "border-slate-900 text-slate-900 bg-slate-50" : 
                        u.role === "SELLER" ? "border-orange-500 text-orange-600 bg-orange-50" : 
                        "border-blue-500 text-blue-600 bg-blue-50"
                      )}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {u.isLocked ? (
                        <div className="flex flex-col">
                           <Badge variant="accent" className="w-fit gap-1 shadow-sm shadow-red-100 bg-red-100 text-red-600 border-red-200">
                              <Lock className="h-3 w-3" /> BỊ KHÓA
                           </Badge>
                           <p className="text-[10px] text-red-400 mt-1 line-clamp-1 italic max-w-[150px]">Lý do: {u.lockReason}</p>
                        </div>
                      ) : (
                        <Badge variant="neutral" className="bg-emerald-50 text-emerald-600 border-emerald-200 gap-1 font-bold">
                           <ShieldCheck className="h-3 w-3" /> HOẠT ĐỘNG
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                      {format(new Date(u.createdAt), "dd/MM/yyyy", { locale: vi })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 text-blue-500 hover:bg-blue-50"
                          onClick={() => { setSelectedUser(u); setShowDetail(true); }}
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {u.role !== "ADMIN" && (
                          <>
                            {u.isLocked ? (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 text-emerald-600 hover:bg-emerald-50" 
                                onClick={() => handleUnlock(u)}
                                title="Mở khóa"
                              >
                                <ShieldCheck className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 text-orange-500 hover:bg-orange-50" 
                                onClick={() => { setSelectedUser(u); setShowLockModal(true); }}
                                title="Khóa tài khoản"
                              >
                                <UserX className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-9 w-9 text-red-500 hover:bg-red-50" 
                              onClick={() => handleDelete(u)}
                              title="Xóa vĩnh viễn"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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

      {/* Detail Modal */}
      {showDetail && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
              <div className="relative h-32 bg-gradient-to-r from-primary/80 to-blue-600">
                 <button 
                  onClick={() => setShowDetail(false)}
                  className="absolute right-4 top-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
                 >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
                 <div className="absolute -bottom-10 left-10">
                    <div className={cn(
                      "h-24 w-24 rounded-3xl border-4 border-white flex items-center justify-center text-white font-black text-3xl shadow-xl",
                      selectedUser.role === "ADMIN" ? "bg-slate-900" : selectedUser.role === "SELLER" ? "bg-orange-500" : "bg-blue-500"
                    )}>
                      {selectedUser.fullName.charAt(0).toUpperCase()}
                    </div>
                 </div>
              </div>

              <div className="px-10 pt-16 pb-10">
                 <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">{selectedUser.fullName}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="font-bold">{(selectedUser.role as string)}</Badge>
                        {selectedUser.isLocked && <Badge variant="accent" className="bg-red-100 text-red-600 border-red-200">ĐANG BỊ KHÓA</Badge>}
                      </div>
                    </div>
                    {selectedUser.role === "SELLER" && (
                       <div className="text-right">
                          <p className="text-sm font-bold text-orange-600 uppercase tracking-tighter">Xác minh Shop</p>
                          <div className="flex items-center gap-1 text-slate-500 mt-1 justify-end">
                             <ShieldCheck className="h-4 w-4 text-emerald-500" />
                             <span className="text-sm font-medium">Hợp lệ</span>
                          </div>
                       </div>
                    )}
                 </div>

                 <div className="grid grid-cols-2 gap-8 mt-10">
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                             <Mail className="h-5 w-5" />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase">Email liên hệ</p>
                             <p className="text-sm font-bold text-slate-700">{selectedUser.email}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                             <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase">Ngày gia nhập</p>
                             <p className="text-sm font-bold text-slate-700">{format(new Date(selectedUser.createdAt), "dd MMMM, yyyy", { locale: vi })}</p>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                             <Store className="h-5 w-5" />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase">Ngân hàng</p>
                             <p className="text-sm font-bold text-slate-700">{selectedUser.bankName || "Chưa cập nhật"}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                             <Receipt className="h-5 w-5" />
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase">Số tài khoản</p>
                             <p className="text-sm font-bold text-slate-700">{selectedUser.bankAccount || "Chưa cập nhật"}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {selectedUser.role === "SELLER" && (
                   <div className="mt-10 bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-5">
                         <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                            <Store className="h-8 w-8 text-orange-500" />
                         </div>
                         <div>
                            <h4 className="font-black text-slate-800 text-lg">{selectedUser.shopName || "Tên Shop đang cập nhật"}</h4>
                            <div className="flex items-center gap-3 mt-1">
                               <span className="flex items-center gap-1 text-xs text-slate-400 font-bold">
                                  <ShoppingBag className="h-3 w-3" /> {selectedUser.totalProducts} Sản phẩm
                               </span>
                               <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                               <span className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-1">
                                  Tới trang cá nhân <ChevronRight className="h-3 w-3" />
                               </span>
                            </div>
                         </div>
                      </div>
                   </div>
                 )}

                 {selectedUser.isLocked && (
                    <div className="mt-8 bg-red-50 border border-red-100 rounded-2xl p-5 flex gap-4">
                       <AlertTriangle className="h-6 w-6 text-red-500 shrink-0" />
                       <div>
                          <p className="text-sm font-black text-red-900 leading-tight">Lý do khóa tài khoản:</p>
                          <p className="text-sm text-red-700 mt-1 italic">"{selectedUser.lockReason}"</p>
                       </div>
                    </div>
                 )}

                 <div className="mt-10 flex gap-4">
                    <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold" onClick={() => setShowDetail(false)}>
                       Đóng lại
                    </Button>
                    {!selectedUser.isLocked && selectedUser.role !== "ADMIN" && (
                       <Button 
                        variant="destructive" 
                        className="flex-1 rounded-xl h-12 font-black shadow-lg shadow-red-200"
                        onClick={() => { setShowDetail(false); setShowLockModal(true); }}
                       >
                          KHÓA NGAY
                       </Button>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Lock Modal */}
      {showLockModal && selectedUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300 px-6">
           <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
              <div className="p-10 text-center">
                 <div className="bg-red-100 h-20 w-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-600 shadow-xl shadow-red-100">
                    <Lock className="h-10 w-10" />
                 </div>
                 <h2 className="text-2xl font-black text-slate-900">Khóa tài khoản</h2>
                 <p className="text-slate-400 text-sm mt-2 font-medium">Bạn phải nhập lý do khóa cụ thể. Người dùng sẽ thấy lý do này khi cố gắng đăng nhập.</p>
                 
                 <div className="mt-8 text-left">
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">LÝ DO CHI TIẾT</label>
                    <textarea 
                      className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 min-h-[120px] focus:border-red-500 focus:bg-white transition-all outline-none text-sm font-medium"
                      placeholder="Ví dụ: Vi phạm quy định đăng bán sản phẩm cấm..."
                      value={lockReason}
                      onChange={(e) => setLockReason(e.target.value)}
                    />
                 </div>

                 <div className="mt-10 flex gap-4">
                    <Button variant="outline" className="flex-1 rounded-2xl h-14 font-bold border-2" onClick={() => setShowLockModal(false)}>
                       Hủy bỏ
                    </Button>
                    <Button 
                      className="flex-1 bg-red-600 hover:bg-red-700 rounded-2xl h-14 font-black shadow-xl shadow-red-200 uppercase"
                      disabled={!lockReason.trim()}
                      onClick={handleLock}
                    >
                       Xác nhận Khóa
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
