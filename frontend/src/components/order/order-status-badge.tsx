import { Badge } from "@/components/ui";
import type { OrderStatus } from "@/types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

function getVariant(status: OrderStatus) {
  switch (status) {
    case "PAID_DEPOSIT":
      return "accent";
    case "COMPLETED":
      return "neutral";
    case "PENDING":
      return "outline";
    case "CANCELLED":
      return "outline";
    default:
      return "neutral";
  }
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return <Badge variant={getVariant(status)}>{status}</Badge>;
}
