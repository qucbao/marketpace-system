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
  FormField,
  FormLabel,
  Input,
} from "@/components/ui";
import { useCart } from "@/hooks/use-cart";
import { cartApi } from "@/lib/api";
import type { CartAddRequest, CartResponse } from "@/types";

interface ProductAddToCartProps {
  productId: number;
}

const initialForm: CartAddRequest = {
  productId: 0,
  quantity: 1,
};

export function ProductAddToCart({ productId }: ProductAddToCartProps) {
  const { refreshCart } = useCart();
  const [form, setForm] = useState<CartAddRequest>({
    ...initialForm,
    productId,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cartItem, setCartItem] = useState<CartResponse | null>(null);

  useEffect(() => {
    setCartItem(null);
    setErrorMessage(null);
    setForm({
      ...initialForm,
      productId,
    });
  }, [productId]);

  function updateQuantity(value: string) {
    setForm((current) => ({
      ...current,
      quantity: value === "" ? 0 : Number(value),
    }));
    setErrorMessage(null);
  }

  async function handleAddToCart() {
    if (!Number.isFinite(form.quantity) || form.quantity <= 0) {
      setErrorMessage("Quantity must be greater than 0");
      return;
    }

    const previousCartItem = cartItem;
    const optimisticQuantity = (cartItem?.quantity ?? 0) + form.quantity;

    setLoading(true);
    setErrorMessage(null);
    setCartItem({
      itemId: cartItem?.itemId ?? -Date.now(),
      userId: cartItem?.userId ?? 0,
      productId,
      productName: cartItem?.productName ?? "Selected product",
      productPrice: cartItem?.productPrice ?? 0,
      quantity: optimisticQuantity,
      totalPrice: (cartItem?.productPrice ?? 0) * optimisticQuantity,
      createdAt: cartItem?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    try {
      const response = await cartApi.add({
        productId,
        quantity: form.quantity,
      });
      setCartItem(response.data);
      await refreshCart(true, true);
      toast.success("Added to cart.");
    } catch (error) {
      setCartItem(previousCartItem);
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to add item to cart",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cart</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField>
          <FormLabel htmlFor="cart-quantity">Quantity</FormLabel>
          <Input
            id="cart-quantity"
            type="number"
            min={1}
            value={form.quantity === 0 ? "" : form.quantity}
            onChange={(event) => updateQuantity(event.target.value)}
            disabled={loading}
          />
        </FormField>

        <Button
          type="button"
          className="w-full"
          isLoading={loading}
          onClick={handleAddToCart}
        >
          Add to cart
        </Button>

        {cartItem ? (
          <div className="rounded-2xl border border-dashed bg-muted/10 px-4 py-3 text-sm text-foreground">
            Da cap nhat gio hang. So luong hien tai:{" "}
            <span className="font-medium">{cartItem.quantity}</span>
          </div>
        ) : null}

        {errorMessage ? (
          <ErrorState
            title="Khong the them vao gio hang"
            description={errorMessage}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
