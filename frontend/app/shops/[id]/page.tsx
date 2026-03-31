import { AlertCircle, Calendar, MapPin, Store, UserCheck } from "lucide-react";

import { ProductCard } from "@/components/product/product-card";
import { AppShell, PageContainer, SectionHeader } from "@/components/ui";
import { productsApi } from "@/lib/api";
import { shopsApi } from "@/lib/api/shops";
import { filesApi } from "@/lib/api/files";
import { ProductResponse, ShopResponse } from "@/types";

type ShopDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ShopDetailPage({ params }: ShopDetailPageProps) {
  const { id } = await params;
  const shopId = Number(id);

  let shop: ShopResponse | null = null;
  let shopProducts: ProductResponse[] = [];
  let errorMsg: string | null = null;

  try {
    const [shopRes, productsRes] = await Promise.all([
      shopsApi.getById(shopId),
      productsApi.getAll(),
    ]);

    shop = shopRes.data;
    shopProducts = productsRes.data.filter((product) => product.shopId === shopId);
  } catch (error) {
    console.error("Lỗi tải thông tin shop:", error);
    errorMsg =
      error instanceof Error
        ? error.message
        : "Không thể tải thông tin cửa hàng";
  }

  if (!shop) {
    return (
      <AppShell>
        <PageContainer className="py-20 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertCircle className="h-8 w-8" />
          </div>
          <p className="text-xl font-semibold">
            {errorMsg || "Cửa hàng không tồn tại"}
          </p>
        </PageContainer>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="border-b bg-muted/20">
        <PageContainer className="py-12">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-[2.5rem] bg-white overflow-hidden border-4 border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] group">
               {shop.avatarUrl ? (
                 <img src={filesApi.getDownloadUrl(shop.avatarUrl)} alt={shop.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
               ) : (
                 <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-teal-500 text-4xl font-black text-white">
                   {shop.name.charAt(0).toUpperCase()}
                 </div>
               )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="mb-2 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                  {shop.name}
                </h1>
                {shop.status === "APPROVED" ? (
                  <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    <UserCheck className="h-3.5 w-3.5" /> Shop Uy Tín
                  </span>
                ) : null}
              </div>
              <p className="max-w-2xl leading-relaxed text-muted-foreground">
                {shop.description}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm md:justify-start">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Chủ shop:</span> {shop.ownerName}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Tham gia từ:</span>{" "}
                  {new Date(shop.createdAt).toLocaleDateString("vi-VN")}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Khu vực:</span> Hồ Chí Minh
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      <PageContainer className="py-12">
        <SectionHeader
          title="Sản phẩm đang bán"
          description={`Tìm thấy ${shopProducts.length} mặt hàng từ cửa hàng này.`}
        />

        {shopProducts.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {shopProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-muted/5 py-20 text-muted-foreground">
            <Store className="mb-4 h-12 w-12 opacity-20" />
            <p className="text-lg">Shop hiện chưa đăng sản phẩm nào.</p>
          </div>
        )}
      </PageContainer>
    </AppShell>
  );
}
