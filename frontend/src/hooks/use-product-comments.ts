"use client";

import { useCallback, useEffect, useState } from "react";

import { productsApi } from "@/lib/api";
import type { CommentResponse } from "@/types";

const COMMENTS_CACHE_TTL = 30_000;

const commentsCache = new Map<
  number,
  {
    data: CommentResponse[] | null;
    fetchedAt: number;
    promise: Promise<CommentResponse[]> | null;
  }
>();

function getCommentsCacheEntry(productId: number) {
  const existingEntry = commentsCache.get(productId);

  if (existingEntry) {
    return existingEntry;
  }

  const nextEntry = {
    data: null,
    fetchedAt: 0,
    promise: null,
  };

  commentsCache.set(productId, nextEntry);
  return nextEntry;
}

function isCommentsCacheFresh(productId: number) {
  const entry = getCommentsCacheEntry(productId);

  return entry.data !== null && Date.now() - entry.fetchedAt < COMMENTS_CACHE_TTL;
}

function writeCommentsCache(productId: number, data: CommentResponse[]) {
  commentsCache.set(productId, {
    data,
    fetchedAt: Date.now(),
    promise: null,
  });
}

export function useProductComments(productId: number) {
  const cacheEntry = getCommentsCacheEntry(productId);
  const [comments, setCommentsState] = useState<CommentResponse[]>(
    cacheEntry.data ?? [],
  );
  const [loading, setLoading] = useState(cacheEntry.data === null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const setComments = useCallback(
    (
      value:
        | CommentResponse[]
        | ((current: CommentResponse[]) => CommentResponse[]),
    ) => {
      setCommentsState((current) => {
        const nextValue =
          typeof value === "function"
            ? value(current)
            : value;

        writeCommentsCache(productId, nextValue);
        return nextValue;
      });
    },
    [productId],
  );

  const refreshComments = useCallback(async (force = false) => {
    const entry = getCommentsCacheEntry(productId);

    if (!force && isCommentsCacheFresh(productId)) {
      setCommentsState(entry.data ?? []);
      setErrorMessage(null);
      setLoading(false);
      return entry.data ?? [];
    }

    if (!force && entry.promise) {
      setLoading(true);

      try {
        const data = await entry.promise;
        setCommentsState(data);
        setErrorMessage(null);
        return data;
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load comments",
        );
        return [];
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    setErrorMessage(null);

    const request = productsApi
      .getComments(productId)
      .then((response) => {
        const data = response.data;
        writeCommentsCache(productId, data);
        return data;
      })
      .finally(() => {
        const currentEntry = getCommentsCacheEntry(productId);
        commentsCache.set(productId, {
          ...currentEntry,
          promise: null,
        });
      });

    commentsCache.set(productId, {
      ...entry,
      promise: request,
    });

    try {
      const data = await request;
      setCommentsState(data);
      return data;
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load comments",
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    const entry = getCommentsCacheEntry(productId);

    if (entry.data) {
      setCommentsState(entry.data);
      setLoading(false);
    }

    void refreshComments(false);
  }, [productId, refreshComments]);

  return {
    comments,
    setComments,
    loading,
    errorMessage,
    refreshComments,
  };
}
