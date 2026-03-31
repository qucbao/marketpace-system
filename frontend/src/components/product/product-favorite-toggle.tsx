"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ErrorState,
  LoadingState,
} from "@/components/ui";
import { favoritesApi } from "@/lib/api";
import type { FavoriteResponse } from "@/types";

interface ProductFavoriteToggleProps {
  productId: number;
}

export function ProductFavoriteToggle({
  productId,
}: ProductFavoriteToggleProps) {
  const [favorite, setFavorite] = useState<FavoriteResponse | null>(null);
  const [loadingState, setLoadingState] = useState(false);
  const [checkingState, setCheckingState] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadFavoriteState() {
      if (active) {
        setCheckingState(true);
        setErrorMessage(null);
      }

      try {
        const response = await favoritesApi.get();
        const currentFavorite =
          response.data.find((item) => item.productId === productId) ?? null;

        if (active) {
          setFavorite(currentFavorite);
        }
      } catch (error) {
        if (active) {
          setFavorite(null);
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load favorite state",
          );
        }
      } finally {
        if (active) {
          setCheckingState(false);
        }
      }
    }

    void loadFavoriteState();

    return () => {
      active = false;
    };
  }, [productId]);

  async function handleToggleFavorite() {
    const previousFavorite = favorite;
    setLoadingState(true);
    setErrorMessage(null);

    try {
      if (favorite) {
        setFavorite(null);
        await favoritesApi.remove(productId);
        toast.success("Removed from favorites.");
      } else {
        const optimisticFavorite: FavoriteResponse = {
          id: -Date.now(),
          userId: 0,
          productId,
          productName: favorite?.productName ?? "Favorite product",
          createdAt: new Date().toISOString(),
        };

        setFavorite(optimisticFavorite);
        const response = await favoritesApi.add(productId);
        setFavorite(response.data);
        toast.success("Saved to favorites.");
      }
    } catch (error) {
      setFavorite(previousFavorite);
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update favorite",
      );
    } finally {
      setLoadingState(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Favorite</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {checkingState ? (
          <LoadingState
            title="Dang kiem tra yeu thich"
            description="Vui long cho trong giay lat."
            className="py-10"
          />
        ) : (
          <Button
            type="button"
            variant={favorite ? "primary" : "secondary"}
            isLoading={loadingState}
            onClick={handleToggleFavorite}
            className="w-full"
          >
            {favorite ? "Favorited" : "Add to favorites"}
          </Button>
        )}

        {!checkingState && errorMessage ? (
          <ErrorState
            title="Khong the cap nhat yeu thich"
            description={errorMessage}
            className="py-6"
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
