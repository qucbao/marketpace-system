"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { favoritesApi } from "@/lib/api/favorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  productId: number;
  initialIsFavorited?: boolean;
  className?: string;
  onToggle?: (isFavorited: boolean) => void;
}

export function FavoriteButton({
  productId,
  initialIsFavorited = false,
  className,
  onToggle,
}: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để yêu thích sản phẩm");
      return;
    }

    setLoading(true);
    try {
      if (isFavorited) {
        await favoritesApi.remove(productId);
        setIsFavorited(false);
        onToggle?.(false);
        toast.success("Đã bỏ yêu thích");
      } else {
        await favoritesApi.add(productId);
        setIsFavorited(true);
        onToggle?.(true);
        toast.success("Đã thêm vào yêu thích");
      }
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "group flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:scale-110 active:scale-95 disabled:opacity-50",
        className
      )}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-colors",
          isFavorited 
            ? "fill-red-500 text-red-500" 
            : "text-muted-foreground group-hover:text-red-500"
        )}
      />
    </button>
  );
}
