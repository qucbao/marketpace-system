import Image from "next/image";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

// Root Card
export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Chuyên dùng cho ảnh sản phẩm
export function CardImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  return (
    <div className={cn("relative aspect-[4/3] w-full overflow-hidden bg-muted", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
          No image
        </div>
      )}
    </div>
  );
}

// Card Header (Giải quyết lỗi Build)
export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6 border-b border-border/50", className)} {...props}>
      {children}
    </div>
  );
}

// Card Title (Giải quyết lỗi Build)
export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold leading-none tracking-tight text-foreground", className)} {...props}>
      {children}
    </h3>
  );
}

// Card Content
export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

// Card Description
export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}
