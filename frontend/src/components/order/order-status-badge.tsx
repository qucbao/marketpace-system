import { Badge } from "@/components/ui";
import type { OrderStatus } from "@/types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

function getVariant(status: OrderStatus) {
  switch (status) {
    case "PENDING": return "outline";
    case "DEPOSIT_SUBMITTED": return "accent";
    case "PAID_DEPOSIT": return "accent";
    case "PREPARING": return "accent";
    case "SHIPPING": return "accent";
    case "DELIVERED": return "accent";
    case "ESCROW_HOLDING": return "accent";
    case "COMPLETED": return "neutral";
    case "CANCELLED": return "outline";
    default: return "neutral";
  }
}

function getLabel(status: OrderStatus) {
  switch (status) {
    case "PENDING": return "Chờ đặt cọc";
    case "DEPOSIT_SUBMITTED": return "Chờ duyệt cọc";
    case "PAID_DEPOSIT": return "Đã cọc/Sẵn sàng";
    case "PREPARING": return "Đang chuẩn bị";
    case "SHIPPING": return "Đang giao hàng";
    case "DELIVERED": return "Đã giao";
    case "ESCROW_HOLDING": return "Đang giam tiền";
    case "COMPLETED": return "Hoàn tất";
    case "CANCELLED": return "Đã hủy";
    default: return status;
  }
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return <Badge variant={getVariant(status)}>{getLabel(status)}</Badge>;
}
