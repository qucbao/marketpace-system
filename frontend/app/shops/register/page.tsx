"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Rocket, Store } from "lucide-react";
import { toast } from "sonner";

import {
  AppShell,
  Button,
  FormField,
  FormLabel,
  FormMessage,
  Input,
  PageContainer,
  Textarea,
} from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { shopsApi } from "@/lib/api/shops";

export default function ShopRegisterPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      toast.error("Vui lòng đăng nhập để đăng ký cửa hàng");
      return;
    }

    setLoading(true);
    try {
      await shopsApi.register({
        ownerId: user.id,
        name: formData.name,
        description: formData.description,
      });
      toast.success("Đăng ký thành công! Vui lòng chờ quản trị viên phê duyệt.");
      router.push("/");
    } catch {
      toast.error("Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageContainer className="max-w-2xl py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Store className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Trở thành Người bán</h1>
          <p className="mt-2 text-muted-foreground">
            Nâng cấp tài khoản để bắt đầu đăng bán sản phẩm chuyên nghiệp.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <div className="space-y-4">
            <FormField>
              <FormLabel htmlFor="shop-name">
                Tên cửa hàng <span className="text-red-500">*</span>
              </FormLabel>
              <Input
                id="shop-name"
                required
                placeholder="Ví dụ: Tiệm đồ cũ của tôi"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={loading}
              />
            </FormField>

            <FormField>
              <FormLabel htmlFor="shop-description">Mô tả chi tiết</FormLabel>
              <Textarea
                id="shop-description"
                required
                rows={4}
                placeholder="Shop của bạn chuyên bán dòng đồ gì? Chính sách bảo hành ra sao?..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={loading}
              />
              <FormMessage>Thông tin này sẽ giúp người mua hiểu rõ hơn về cửa hàng của bạn.</FormMessage>
            </FormField>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>
              Sau khi gửi, chúng tôi sẽ xem xét thông tin của bạn. Trạng thái
              {" "}
              <span className="font-semibold">APPROVED</span>
              {" "}
              sẽ giúp bạn có quyền đăng thêm sản phẩm.
            </p>
          </div>

          <Button type="submit" className="w-full py-6 text-lg" isLoading={loading}>
            <Rocket className="mr-2 h-5 w-5" /> Gửi yêu cầu phê duyệt
          </Button>
        </form>
      </PageContainer>
    </AppShell>
  );
}
