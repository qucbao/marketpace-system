"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, Users, ShoppingBag, Tags, Receipt, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/cn";

const sidebarLinks = [
  {
    title: "Tổng quan",
    href: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Duyệt cửa hàng",
    href: "/admin/shops",
    icon: <Store className="h-5 w-5" />,
  },
  {
    title: "Quản lý danh mục",
    href: "/admin/categories",
    icon: <Tags className="h-5 w-5" />,
  },
  {
    title: "Giao dịch cọc",
    href: "/admin/orders",
    icon: <Receipt className="h-5 w-5" />,
  },
  {
    title: "Quản lý Giam tiền",
    href: "/admin/escrow",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: "Quản lý người dùng",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-white transition-transform max-md:-translate-x-full">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight text-primary">
            REUSE<span className="text-accent">.admin</span>
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
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {link.icon}
              {link.title}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
