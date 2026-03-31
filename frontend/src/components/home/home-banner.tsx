"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BANNERS = [
  {
    id: 1,
    image: "http://localhost:8080/api/files/download/1.jfif",
    title: "Săn đồ cũ giá hời",
    subtitle: "Chất lượng mới 99%",
    description: "Cộng đồng mua bán đồ cũ uy tín nhất hiện nay.",
  },
  {
    id: 2,
    image: "http://localhost:8080/api/files/download/2.jfif",
    title: "Tái sử dụng - Tiết kiệm",
    subtitle: "Bảo vệ môi trường",
    description: "Gia tăng vòng đời sản phẩm, giảm thiểu rác thải nhựa.",
  },
  {
    id: 3,
    image: "http://localhost:8080/api/files/download/3.jfif",
    title: "Kho đồ hiệu giá rẻ",
    subtitle: "Chỉ từ 50k",
    description: "Khám phá hàng ngàn món đồ độc lạ mỗi ngày.",
  },
  {
    id: 4,
    image: "http://localhost:8080/api/files/download/4.jfif",
    title: "Mở Shop ngay hôm nay",
    subtitle: "Doanh thu đột phá",
    description: "Kết nối hàng triệu người mua tiềm năng trên toàn quốc.",
  },
];

export function HomeBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % BANNERS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % BANNERS.length);
  const prev = () => setIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);

  return (
    <div className="relative mb-12 h-[300px] md:h-[450px] w-full overflow-hidden rounded-[2.5rem] shadow-2xl group">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full"
        >
          {/* Background Image */}
          <div 
             className="absolute inset-0 bg-cover bg-center"
             style={{ backgroundImage: `url(${BANNERS[index].image})` }}
          />
          {/* Enhanced Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />
          
          {/* Content */}
          <div className="relative flex h-full flex-col justify-center px-10 md:px-20 max-w-3xl">
             <motion.div
               initial={{ x: -30, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.2, duration: 0.6 }}
             >
                <div className="inline-block rounded-full bg-primary/20 backdrop-blur-md px-4 py-1 text-xs font-black uppercase tracking-widest text-primary-foreground mb-4 border border-white/10">
                   {BANNERS[index].subtitle}
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-lg">
                   {BANNERS[index].title}
                </h2>
                <p className="mt-4 text-sm md:text-xl text-slate-200 font-medium opacity-90 drop-shadow">
                   {BANNERS[index].description}
                </p>
                <div className="mt-8 flex gap-4">
                   <Link
                      href="/shops/register"
                      className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-black text-white transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30 active:scale-95"
                   >
                      <PlusCircle className="h-5 w-5" /> Mở shop ngay
                   </Link>
                   <Link
                      href="/products"
                      className="inline-flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md px-8 py-4 font-black text-white border border-white/20 transition-all hover:bg-white/20 active:scale-95"
                   >
                      Khám phá ngay
                   </Link>
                </div>
             </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button 
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button 
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 transition-all rounded-full ${i === index ? "w-10 bg-primary" : "w-2 bg-white/40 hover:bg-white/60"}`}
          />
        ))}
      </div>
    </div>
  );
}
