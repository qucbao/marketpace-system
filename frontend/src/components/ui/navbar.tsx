import Link from "next/link";
import { cn } from "@/lib/cn";
// Giả định bạn sẽ cài lucide-react (Senior luôn dùng icon để UX tốt hơn)
import { Search, Heart, ShoppingCart, PlusCircle, Menu } from "lucide-react";

const links = [
  { href: "/products", label: "Khám phá" },
  { href: "/shops", label: "Cửa hàng" },
];

export function Navbar({ className }: { className?: string }) {
  return (
    <header className={cn("sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md", className)}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-primary">
              REUSE<span className="text-accent">.hub</span>
            </span>
          </Link>

          {/* Nav Links - Desktop */}
          <nav className="hidden items-center gap-6 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Search Bar - Tâm điểm của Marketplace */}
        <div className="hidden max-w-md flex-1 px-8 md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm đồ cũ giá hời..."
              className="h-10 w-full rounded-full border border-border bg-muted/50 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/favorites" className="hidden p-2 text-muted-foreground hover:text-primary sm:block">
            <Heart className="h-5 w-5" />
          </Link>

          <Link href="/cart" className="relative p-2 text-muted-foreground hover:text-primary">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
              2
            </span>
          </Link>

          <Link
            href="/products/create"
            className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Bán đồ ngay</span>
          </Link>

          <button className="p-2 lg:hidden">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}