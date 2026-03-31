"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Star, Image as ImageIcon, X, Camera, LucideIcon } from "lucide-react";
import Image from "next/image";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  ErrorState,
  FormField,
  FormLabel,
  LoadingState,
  Textarea,
} from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { useProductComments } from "@/hooks/use-product-comments";
import { productsApi, ordersApi, filesApi } from "@/lib/api";
import type { CommentCreateRequest, CommentResponse, OrderResponse } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCommentsProps {
  productId: number;
}

const initialForm: Partial<CommentCreateRequest> = {
  content: "",
  rating: 5,
  imageUrls: "",
};

function formatCommentDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function ProductComments({ productId }: ProductCommentsProps) {
  const { user } = useAuth();
  const {
    comments,
    setComments,
    loading: loadingComments,
    errorMessage,
  } = useProductComments(productId);

  const [form, setForm] = useState<Partial<CommentCreateRequest>>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [eligibleOrders, setEligibleOrders] = useState<OrderResponse[]>([]);
  const [loadingEligibility, setLoadingEligibility] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tempImages, setTempImages] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setLoadingEligibility(true);
      ordersApi.getEligibleToReview(productId)
        .then(res => setEligibleOrders(res.data))
        .catch(err => console.error("Error checking eligibility", err))
        .finally(() => setLoadingEligibility(false));
    }
  }, [productId, user]);

  function updateForm(updates: Partial<CommentCreateRequest>) {
    setForm((current) => ({ ...current, ...updates }));
    setFormError(null);
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await filesApi.upload(file);
      const newImages = [...tempImages, res.data];
      setTempImages(newImages);
      updateForm({ imageUrls: newImages.join(",") });
      toast.success("Tải ảnh lên thành công", { id: "review-upload" });
    } catch (err) {
      toast.error("Không thể tải ảnh lên", { id: "review-upload" });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = tempImages.filter((_, i) => i !== index);
    setTempImages(newImages);
    updateForm({ imageUrls: newImages.join(",") });
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      toast.error("Vui lòng đăng nhập để đánh giá");
      return;
    }

    const content = form.content?.trim();
    if (!content) {
      setFormError("Nội dung đánh giá không được để trống");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const response = await productsApi.createComment(productId, {
        content,
        rating: form.rating || 5,
        imageUrls: form.imageUrls,
        orderId: eligibleOrders[0]?.id // Tự động chọn đơn hàng đầu tiên hợp lệ
      } as CommentCreateRequest);

      setComments((current) => [response.data, ...current]);
      setForm(initialForm);
      setTempImages([]);
      setEligibleOrders(prev => prev.slice(1)); // Xóa đơn hàng đã dùng
      toast.success("Gửi đánh giá thành công!");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Không thể gửi đánh giá");
    } finally {
      setSubmitting(false);
    }
  }

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={cn(
              "h-4 w-4 transition-all",
              s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200",
              interactive && "cursor-pointer hover:scale-125"
            )}
            onClick={() => interactive && updateForm({ rating: s })}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Review Summary */}
      <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
         <div className="text-center md:border-r md:pr-10 border-slate-100">
            <h2 className="text-5xl font-black text-slate-900 mb-2">
               {comments.length > 0 
                  ? (comments.reduce((a, b) => a + b.rating, 0) / comments.length).toFixed(1)
                  : "5.0"}
            </h2>
            {renderStars(Math.round(comments.length > 0 ? comments.reduce((a, b) => a + b.rating, 0) / comments.length : 5))}
            <p className="text-xs font-bold text-slate-400 mt-4 uppercase tracking-widest">{comments.length} Đánh giá</p>
         </div>
         
         <div className="flex-1 space-y-3 w-full">
            {[5, 4, 3, 2, 1].map(s => {
               const count = comments.filter(c => c.rating === s).length;
               const percent = comments.length > 0 ? (count / comments.length) * 100 : 0;
               return (
                  <div key={s} className="flex items-center gap-4">
                     <span className="text-xs font-bold text-slate-500 w-4">{s}</span>
                     <div className="flex-1 h-2 bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full transition-all duration-1000" style={{ width: `${percent}%` }} />
                     </div>
                     <span className="text-[10px] font-black text-slate-300 w-8">{percent.toFixed(0)}%</span>
                  </div>
               );
            })}
         </div>
      </section>

      {/* Review Form */}
      {user && (loadingEligibility ? (
        <div className="animate-pulse bg-slate-50 h-40 rounded-3xl" />
      ) : eligibleOrders.length > 0 ? (
        <Card className="rounded-[2.5rem] border-2 border-primary/5 shadow-xl shadow-primary/5 overflow-hidden">
          <CardHeader className="bg-slate-50/50 pb-4">
             <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" /> Chia sẻ cảm nhận của bạn
             </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                 <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Chất lượng sản phẩm</FormLabel>
                 {renderStars(form.rating || 5, true)}
              </div>

              <div className="space-y-3">
                <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Nội dung đánh giá</FormLabel>
                <Textarea
                  value={form.content}
                  onChange={(e) => updateForm({ content: e.target.value })}
                  placeholder="Sản phẩm dùng tốt, đúng như mô tả..."
                  className="min-h-[120px] rounded-2xl border-slate-100 focus:border-primary transition-all resize-none"
                  disabled={submitting}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                 <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-400">Hình ảnh thực tế</FormLabel>
                 <div className="flex flex-wrap gap-3">
                    {tempImages.map((img, i) => (
                       <div key={i} className="relative h-20 w-20 rounded-xl overflow-hidden border border-slate-100">
                          <img src={filesApi.getDownloadUrl(img)} className="h-full w-full object-cover" />
                          <button 
                             type="button"
                             onClick={() => removeImage(i)}
                             className="absolute top-1 right-1 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-500 transition-all"
                             style={{ opacity: 1 }}
                          >
                             <X className="h-3 w-3" />
                          </button>
                       </div>
                    ))}
                    {tempImages.length < 5 && (
                       <label className="h-20 w-20 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-100 text-slate-300 hover:border-primary hover:text-primary transition-all cursor-pointer">
                          {uploading ? (
                             <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                          ) : (
                             <>
                                <ImageIcon className="h-5 w-5 mb-1" />
                                <span className="text-[10px] font-bold">Thêm ảnh</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                             </>
                          )}
                       </label>
                    )}
                 </div>
              </div>

              {formError && <p className="text-sm font-bold text-red-500 bg-red-50 p-4 rounded-xl">{formError}</p>}

              <Button type="submit" isLoading={submitting} className="w-full md:w-auto h-12 px-10 rounded-2xl font-black uppercase tracking-widest text-xs">
                Gửi đánh giá ngay
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200 text-center">
           <p className="text-sm font-bold text-slate-500">Chỉ những khách hàng đã mua sản phẩm này mới có quyền đánh giá.</p>
        </div>
      ))}

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-slate-900 mb-6">Đánh giá gần đây</h3>
        
        {loadingComments ? (
          <LoadingState title="Đang tải..." description="Chờ xíu nhé" />
        ) : comments.length === 0 ? (
          <EmptyState
            title="Chưa có đánh giá nào cho sản phẩm "
            description="Hãy mua hàng và trở thành người đầu tiên đánh giá nhé!"
            className="rounded-3xl border border-slate-50 bg-slate-50/30"
          />
        ) : (
          <div className="grid gap-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-4 mb-4">
                   <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-sm">
                      {comment.userName.charAt(0)}
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-slate-900 leading-none mb-1.5">{comment.userName}</h4>
                      <div className="flex items-center gap-3">
                         {renderStars(comment.rating)}
                         <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{formatCommentDate(comment.createdAt)}</span>
                      </div>
                   </div>
                </div>
                
                <p className="text-sm leading-relaxed text-slate-600 mb-4 whitespace-pre-wrap">
                  {comment.content}
                </p>

                {comment.imageUrls && (
                   <div className="flex flex-wrap gap-2">
                      {comment.imageUrls.split(",").map((img, idx) => (
                         <div key={idx} className="relative h-20 w-32 rounded-xl overflow-hidden border border-slate-50">
                            <img src={filesApi.getDownloadUrl(img)} className="h-full w-full object-cover" />
                         </div>
                      ))}
                   </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
