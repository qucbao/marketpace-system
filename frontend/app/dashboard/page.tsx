"use client";

import { useEffect, useState } from "react";
import { User, Shield, Mail, Save, FileText } from "lucide-react";
import { toast } from "sonner";

import { usersApi, type UserProfileResponse } from "@/lib/api/users";
import { useAuth } from "@/hooks/use-auth";
import { AppShell, PageContainer, SectionHeader } from "@/components/ui";

export default function ProfilePage() {
  const { user: authUser, login } = useAuth(); // login is actually the saveSession method from AuthContext
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankName, setBankName] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const res = await usersApi.getProfile();
        if (res.success && res.data) {
          setProfile(res.data);
          setFullName(res.data.fullName);
          setBankAccount(res.data.bankAccount || "");
          setBankName(res.data.bankName || "");
        }
      } catch (error: any) {
        toast.error(error.message || "Không tải được thông tin");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !profile) return;

    try {
      setSaving(true);
      const res = await usersApi.updateProfile({ 
        fullName,
        bankAccount: bankAccount.trim(),
        bankName: bankName.trim()
      });
      if (res.success && res.data) {
        setProfile(res.data);
        toast.success("Cập nhật thông tin thành công!");
        
        // Sync vối Auth Token (tuy nhiên chỉ sync name, token không đổi nhưng state context sẽ được refesh một phần UI)
        if (authUser) {
           login({ ...authUser, fullName: res.data.fullName });
        }
      }
    } catch (error: any) {
       toast.error(error.message || "Có lỗi xảy ra khi cập nhật!");
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
     if (role === "ADMIN") return "bg-primary/10 text-primary";
     if (role === "SELLER") return "bg-orange-500/10 text-orange-600";
     return "bg-slate-500/10 text-slate-600";
  };

  return (
    <AppShell>
      <PageContainer>
        <SectionHeader
          eyebrow="Tài khoản"
          title="Hồ sơ của tôi"
          description="Quản lý thông tin bảo mật và định danh tài khoản"
        />

        <div className="mt-10 max-w-2xl bg-white border border-border shadow-sm rounded-xl overflow-hidden">
           {loading ? (
             <div className="p-12 text-center flex flex-col items-center justify-center">
               <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-md" />
               <p className="mt-4 text-sm text-muted-foreground">Đang tải hồ sơ...</p>
             </div>
           ) : profile ? (
             <form onSubmit={handleUpdate} className="flex flex-col">
               <div className="p-6 md:p-8 space-y-6">
                 
                 <div className="flex flex-col gap-2 pb-4 border-b">
                   <h2 className="text-xl font-semibold tracking-tight">Chi tiết tài khoản</h2>
                   <p className="text-sm text-muted-foreground">Hiển thị cấp độ người dùng và thông tin định danh của bạn.</p>
                 </div>

                 {/* Role Card */}
                 <div className="flex items-center p-4 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex-1 flex gap-3 items-center">
                       <Shield className="h-5 w-5 text-slate-400" />
                       <div>
                         <p className="text-sm font-medium text-slate-900">Vai trò cấp độ</p>
                         <p className="text-xs text-muted-foreground mt-0.5" >(Không thể tự thay đổi)</p>
                       </div>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${getRoleBadgeColor(profile.role)}`}>
                         {profile.role}
                      </span>
                    </div>
                 </div>

                 <div className="grid gap-6 mt-4">
                    {/* Full Name Input */}
                    <div className="space-y-2">
                       <label htmlFor="fullName" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                         <User className="h-4 w-4 text-slate-400" />
                         Họ và tên
                       </label>
                       <input
                         type="text"
                         id="fullName"
                         value={fullName}
                         onChange={(e) => setFullName(e.target.value)}
                         className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                         required
                       />
                    </div>

                    {/* Email Read-only */}
                    <div className="space-y-2">
                       <label htmlFor="email" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                         <Mail className="h-4 w-4 text-slate-400" />
                         Email đăng nhập
                       </label>
                       <input
                         type="email"
                         id="email"
                         value={profile.email}
                         disabled
                         className="flex h-11 w-full rounded-md border border-transparent bg-slate-100 text-slate-500 px-3 py-2 text-sm cursor-not-allowed font-medium"
                       />
                       <p className="text-xs text-muted-foreground pt-1">Email được bảo vệ mặc định bởi hệ thống.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                      {/* Bank Name */}
                      <div className="space-y-2">
                        <label htmlFor="bankName" className="text-sm font-medium text-slate-700">Tên ngân hàng</label>
                        <input
                          type="text"
                          id="bankName"
                          placeholder="Ví dụ: Vietcombank"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
                        />
                      </div>

                      {/* Bank Account */}
                      <div className="space-y-2">
                        <label htmlFor="bankAccount" className="text-sm font-medium text-slate-700">Số tài khoản (STK)</label>
                        <input
                          type="text"
                          id="bankAccount"
                          placeholder="Nhập số tài khoản của bạn"
                          value={bankAccount}
                          onChange={(e) => setBankAccount(e.target.value)}
                          className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
                        />
                      </div>
                    </div>
                    
                    {/* UID View*/}
                    <div className="block pt-2">
                       <p className="text-xs font-mono text-slate-400 flex items-center gap-1.5 bg-slate-50 inline-flex px-2 py-1 rounded-md">
                          <FileText className="h-3 w-3" /> UID: #{profile.id} • Ngày tạo: {new Date(profile.createdAt).toLocaleDateString("vi-VN")}
                       </p>
                    </div>
                 </div>
                 
               </div>

               <div className="bg-slate-50 px-6 py-4 border-t flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={saving || (fullName === profile.fullName && bankAccount === (profile.bankAccount || "") && bankName === (profile.bankName || ""))}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 text-white px-6 py-2.5 text-sm font-semibold transition-all shadow-sm focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
               </div>
             </form>
           ) : (
             <div className="p-8 text-center text-red-500 font-medium">Lỗi kết nối Server! Không thể lấy Profile.</div>
           )}
        </div>
      </PageContainer>
    </AppShell>
  );
}
