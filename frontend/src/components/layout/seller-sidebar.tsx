"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, ShoppingBag, Receipt, Settings } from "lucide-react";

import { cn } from "@/lib/cn";

const sidebarLinks = [
  {
    title: "Tổng quan Shop",
    href: "/seller",
    icon: <Store className="h-5 w-5" />,
  },
  {
    title: "Quản lý sản phẩm",
    href: "/seller/products",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    title: "Quản lý đơn hàng",
    href: "/seller/orders",
    icon: <Receipt className="h-5 w-5" />,
  },
  {
    title: "Cài đặt Shop",
    href: "/seller/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function SellerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-white transition-transform max-md:-translate-x-full">
      <div className="flex h-16 items-center border-b px-6 bg-orange-50/30">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight text-orange-600">
            SELLER<span className="text-slate-900">.center</span>
          </span>
        </Link>
      </div>

      <div className="flex flex-col gap-2 p-4">
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(`${link.href}/`);
          
          return (
            <Link
              key={link.title}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-orange-500/10 text-orange-600"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {link.icon}
              {link.title}
            </Link>
          );
        })}
      </div>
      
      <div className="absolute bottom-4 left-4 right-4">
         <div className="rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 p-4 text-white shadow-md">
            <h4 className="font-semibold text-sm">Cần hỗ trợ?</h4>
            <p className="text-xs text-orange-100 mt-1 mb-3">Liên hệ đội ngũ Admin ngay.</p>
            <button className="w-full rounded-md bg-white/20 hover:bg-white/30 px-3 py-1.5 text-xs font-medium transition-colors">
               Gọi Hotline
            </button>
         </div>
      </div>
    </aside>
  );
}
