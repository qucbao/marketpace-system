"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Menu, PlusCircle, Search, ShoppingCart, Store } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Button, Input, PageContainer } from "@/components/ui";
import { UserDropdown } from "@/components/layout/user-dropdown";

const links = [
  { href: "/products", label: "Khám phá" },
  { href: "/shops", label: "Cửa hàng" },
];

export function Header() {
  const { items } = useCart();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/products?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md">
      <PageContainer className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-primary">
              Marketplace<span className="text-accent">.vn</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-1 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden max-w-md flex-1 md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="rounded-full border-border bg-muted/50 pl-10 pr-4 text-slate-900 focus-visible:ring-primary/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/favorites"
            className="hidden rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:block"
          >
            <Heart className="h-5 w-5" />
          </Link>

          <Link
            href="/cart"
            className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <ShoppingCart className="h-5 w-5" />
            {items.length > 0 ? (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {items.length}
              </span>
            ) : null}
          </Link>

          <div className="flex items-center gap-2 border-l pl-2 sm:pl-4">
            {loading ? (
              <div className="px-2 text-sm text-muted-foreground">Loading...</div>
            ) : isAuthenticated && user ? (
              <UserDropdown user={user} logout={logout} />
            ) : (
              <div className="flex items-center gap-1">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-xs font-semibold sm:text-sm">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register" className="hidden sm:block">
                  <Button variant="outline" size="sm" className="text-sm font-semibold">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}
          </div>

            {isAuthenticated && user?.role === "SELLER" ? (
            <Link
              href="/seller"
              className="flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-orange-700 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30 focus-visible:ring-offset-2"
            >
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">Kênh người bán</span>
            </Link>
          ) : !isAuthenticated || user?.role === "USER" ? (
            <Link
              href="/shops/register"
              className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Mở shop ngay</span>
            </Link>
          ) : null}

          <button
            className="cursor-not-allowed p-2 text-muted-foreground/60 lg:hidden"
            disabled
            aria-label="Mobile menu coming soon"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </PageContainer>
    </header>
  );
}
