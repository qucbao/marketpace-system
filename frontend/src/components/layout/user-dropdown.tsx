"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  LogOut,
  Shield,
  User,
  Store,
  Receipt,
} from "lucide-react";

import type { AuthResponse } from "@/types";

/* ────────────────────────────────────────────────────────── */
/*  Menu item config — dễ mở rộng thêm mục mới              */
/* ────────────────────────────────────────────────────────── */

interface MenuItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  /** Chỉ hiện khi user có role nằm trong mảng này */
  roles?: string[];
  /** Nếu có onClick thì render button thay vì link */
  onClick?: () => void;
  danger?: boolean;
}

function buildMenuItems(logout: () => void): MenuItem[] {
  return [
    {
      label: "Trang cá nhân",
      href: "/dashboard",
      icon: <User className="h-4 w-4" />,
    },
    {
      label: "Quản trị hệ thống",
      href: "/admin",
      icon: <Shield className="h-4 w-4" />,
      roles: ["ADMIN"],
    },
    {
      label: "Kênh Người Bán",
      href: "/seller",
      icon: <Store className="h-4 w-4" />,
      roles: ["SELLER"],
    },
    {
      label: "Đơn hàng của tôi",
      href: "/orders",
      icon: <Receipt className="h-4 w-4" />,
    },
    {
      label: "Đăng xuất",
      icon: <LogOut className="h-4 w-4" />,
      onClick: logout,
      danger: true,
    },
  ];
}

/* ────────────────────────────────────────────────────────── */
/*  Avatar helpers                                           */
/* ────────────────────────────────────────────────────────── */

function getInitials(name: string) {
  return name.charAt(0).toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-amber-500",
    "from-rose-500 to-pink-500",
    "from-indigo-500 to-blue-500",
  ];
  const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return colors[idx % colors.length];
}

/* ────────────────────────────────────────────────────────── */
/*  Component                                                */
/* ────────────────────────────────────────────────────────── */

interface UserDropdownProps {
  user: AuthResponse;
  logout: () => void;
}

export function UserDropdown({ user, logout }: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Hover open / close với delay nhỏ tránh flicker ── */
  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  /* ── Click outside → close (fallback cho mobile) ── */
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  /* ── Escape → close ── */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const menuItems = buildMenuItems(logout).filter(
    (item) => !item.roles || item.roles.includes(user.role),
  );

  const firstName = user.fullName.split(" ")[0];

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* ── Trigger ── */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full px-2 py-1.5 transition-all hover:bg-muted/60"
        aria-haspopup="true"
        aria-expanded={open}
        id="user-menu-trigger"
      >
        {/* Avatar */}
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white shadow-sm ${getAvatarColor(user.fullName)}`}
        >
          {getInitials(user.fullName)}
        </span>

        {/* Name — ẩn trên mobile */}
        <span className="hidden text-sm font-medium text-foreground lg:inline">
          {firstName}
        </span>

        {/* Chevron */}
        <ChevronDown
          className={`hidden h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 lg:inline ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right animate-in fade-in slide-in-from-top-2 duration-200"
          role="menu"
          aria-labelledby="user-menu-trigger"
        >
          <div className="overflow-hidden rounded-xl border border-border bg-white shadow-xl shadow-black/5">
            {/* Header info */}
            <div className="border-b border-border bg-muted/30 px-4 py-3">
              <p className="truncate text-sm font-semibold text-foreground">
                {user.fullName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
              {user.role === "ADMIN" && (
                <span className="mt-1.5 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                  Admin
                </span>
              )}
              {user.role === "SELLER" && (
                <span className="mt-1.5 inline-block rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-orange-600">
                  Seller
                </span>
              )}
            </div>

            {/* Items */}
            <div className="py-1.5">
              {menuItems.map((item) => {
                const baseClasses =
                  "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors";

                const colorClasses = item.danger
                  ? "text-red-600 hover:bg-red-50"
                  : "text-foreground hover:bg-muted/50 hover:text-primary";

                if (item.onClick) {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      role="menuitem"
                      className={`${baseClasses} ${colorClasses}`}
                      onClick={() => {
                        setOpen(false);
                        item.onClick!();
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href!}
                    role="menuitem"
                    className={`${baseClasses} ${colorClasses}`}
                    onClick={() => setOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
