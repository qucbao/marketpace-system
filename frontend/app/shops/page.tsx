import Link from "next/link";
import { ArrowRight, MapPin, Plus } from "lucide-react";

import { AppShell, Button, EmptyState, ErrorState, PageContainer, SectionHeader } from "@/components/ui";
import { shopsApi } from "@/lib/api/shops";
import { filesApi } from "@/lib/api/files";
import { ShopResponse } from "@/types";

export default async function ShopsPage() {
  let shops: ShopResponse[] = [];
  let errorMsg: string | null = null;

  try {
    const response = await shopsApi.getAll();
    shops = response.data;
  } catch (error) {
    console.error("Fetch shops failed:", error);
    errorMsg =
      "Lỗi kết nối Backend. Hãy đảm bảo Server Spring Boot đang chạy tại Port 8080.";
  }

  return (
    <AppShell>
      <PageContainer className="py-10">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            title="Cửa hàng đối tác"
            description="Khám phá các shop đồ cũ uy tín trên hệ thống REUSE.hub"
            className="mb-0"
          />
          <Link href="/shops/register">
            <Button className="rounded-full px-6 shadow-lg shadow-primary/10 transition-transform hover:scale-105">
              <Plus className="mr-2 h-5 w-5" /> Mở Shop ngay
            </Button>
          </Link>
        </div>

        {errorMsg ? (
          <ErrorState
            title="Không thể tải danh sách shop"
            description={errorMsg}
          />
        ) : shops.length === 0 ? (
          <EmptyState
            title="Chưa có shop nào được duyệt"
            description="Các cửa hàng mới sẽ xuất hiện tại đây sau khi được phê duyệt."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shops.map((shop) => (
              <Link key={shop.id} href={`/shops/${shop.id}`} className="group">
                <div className="relative flex h-full flex-col rounded-2xl border bg-white p-6 transition-all hover:border-primary/50 hover:shadow-xl">
                  <div
                    className={`absolute right-4 top-4 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      shop.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {shop.status}
                  </div>

                   <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 overflow-hidden border border-slate-50 transition-colors group-hover:border-primary/30">
                      {shop.avatarUrl ? (
                        <img src={filesApi.getDownloadUrl(shop.avatarUrl)} alt={shop.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary/10 text-xl font-bold text-primary">
                          {shop.name ? shop.name.charAt(0).toUpperCase() : "S"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden pr-10">
                      <h3 className="truncate text-lg font-bold text-foreground group-hover:text-primary">
                        {shop.name}
                      </h3>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> Toàn quốc
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 grow line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {shop.description || "Chưa có mô tả cửa hàng."}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <div className="text-xs">
                      <p className="text-[10px] font-medium uppercase text-muted-foreground">Chủ shop</p>
                      <p className="font-semibold">{shop.ownerName}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </PageContainer>
    </AppShell>
  );
}
