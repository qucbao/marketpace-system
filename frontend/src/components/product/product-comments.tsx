"use client";

import { useState } from "react";
import { toast } from "sonner";

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
import { productsApi } from "@/lib/api";
import type { CommentCreateRequest, CommentResponse } from "@/types";

interface ProductCommentsProps {
  productId: number;
}

const initialForm: CommentCreateRequest = {
  content: "",
};

function formatCommentDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
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
  const [form, setForm] = useState<CommentCreateRequest>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function updateContent(value: string) {
    setForm((current) => ({
      ...current,
      content: value,
    }));
    setFormError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const content = form.content.trim();

    if (!content) {
      setFormError("Comment content is required");
      return;
    }

    const previousComments = comments;
    const optimisticComment: CommentResponse = {
      id: -Date.now(),
      productId,
      userId: user?.id ?? 0,
      userName: user?.fullName ?? "You",
      content,
      createdAt: new Date().toISOString(),
    };

    setSubmitting(true);
    setFormError(null);
    setComments((current) => [...current, optimisticComment]);
    setForm(initialForm);

    try {
      const response = await productsApi.createComment(productId, {
        content,
      });

      setComments((current) =>
        current.map((comment) =>
          comment.id === optimisticComment.id ? response.data : comment,
        ),
      );
      toast.success("Comment posted successfully.");
    } catch (error) {
      setComments(previousComments);
      setForm({ content });
      setFormError(
        error instanceof Error ? error.message : "Unable to add comment",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <FormField>
            <FormLabel htmlFor="comment-content">Comment</FormLabel>
            <Textarea
              id="comment-content"
              rows={4}
              value={form.content}
              onChange={(event) => updateContent(event.target.value)}
              placeholder="Write a comment"
              disabled={submitting}
            />
          </FormField>

          {formError ? (
            <ErrorState
              title="Khong the gui binh luan"
              description={formError}
            />
          ) : null}

          <Button type="submit" isLoading={submitting}>
            Add comment
          </Button>
        </form>

        <div className="space-y-4 border-t border-[var(--border)] pt-6">
          {loadingComments ? (
            <LoadingState
              title="Đang tải bình luận"
              description="Vui lòng chờ trong giây lát."
              className="py-10"
            />
          ) : null}

          {!loadingComments && errorMessage ? (
            <ErrorState
              title="Không thể tải bình luận"
              description={errorMessage}
              className="py-10"
            />
          ) : null}

          {!loadingComments && !errorMessage && comments.length === 0 ? (
            <EmptyState
              title="Chưa có bình luận nào"
              description="Hãy là người đầu tiên chia sẻ đánh giá của bạn."
              className="py-10"
            />
          ) : null}

          {!loadingComments && !errorMessage && comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-[var(--border)] bg-white px-5 py-5"
                >
                  <p className="whitespace-pre-line text-sm leading-7 text-[var(--foreground)]">
                    {comment.content}
                  </p>
                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                    {formatCommentDate(comment.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
