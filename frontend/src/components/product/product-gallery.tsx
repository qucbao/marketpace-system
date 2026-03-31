"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { filesApi } from "@/lib/api/files";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  imageUrls: string[];
  productName: string;
}

export function ProductGallery({ imageUrls, productName }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
        <ImageIcon className="h-16 w-16" />
      </div>
    );
  }

  const next = () => setIndex((prev) => (prev + 1) % imageUrls.length);
  const prev = () => setIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);

  const getFullUrl = (url: string) => filesApi.getDownloadUrl(url.split('/').pop() || '');

  return (
    <div className="space-y-4">
      {/* Main image container */}
      <div className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-muted shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            <Image
              src={getFullUrl(imageUrls[index])}
              alt={`${productName} - ${index + 1}`}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 66vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons - only show if multiple images */}
        {imageUrls.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-800 shadow-md backdrop-blur-sm transition-all hover:bg-white focus:outline-none"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-800 shadow-md backdrop-blur-sm transition-all hover:bg-white focus:outline-none"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            {/* Pagination dots */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {imageUrls.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all",
                    i === index ? "bg-orange-500 w-4" : "bg-white/60"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails - scrollable grid */}
      {imageUrls.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {imageUrls.map((url, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={cn(
                "relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                i === index ? "border-orange-500 ring-2 ring-orange-500/20" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={getFullUrl(url)}
                alt={`Thumbnail ${i}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
