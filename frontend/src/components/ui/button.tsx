"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

// 1. Định nghĩa các kiểu biến thể và kích thước
export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "destructive";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
  isLoading?: boolean; // Thêm trạng thái loading cho các nút bấm API
}

// 2. Mapping class cho từng Variant (Sử dụng CSS Variables của bạn)
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-accent bg-accent text-white hover:opacity-90 shadow-sm",
  secondary:
    "border border-border bg-white text-[var(--foreground)] hover:bg-muted/60",
  outline:
    "border border-border bg-transparent text-[var(--foreground)] hover:bg-muted/50",
  ghost:
    "border border-transparent bg-transparent text-[var(--foreground)] hover:bg-muted/50",
  destructive:
    "border border-red-500 bg-red-500 text-white hover:bg-red-600 hover:border-red-600",
};

// 3. Mapping class cho từng Size
const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10 p-0 flex items-center justify-center", // Nút vuông/tròn cho icon
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        // Base styles: Căn giữa, bo góc, hiệu ứng transition
        "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200",
        "outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97]",

        // Bo tròn đặc biệt cho icon
        size === "icon" ? "rounded-full" : "rounded-md",

        // Dynamic classes
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          {/* Spinner đơn giản khi đang load */}
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Đang xử lý...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
