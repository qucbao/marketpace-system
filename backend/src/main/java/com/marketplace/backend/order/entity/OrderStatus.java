package com.marketplace.backend.order.entity;

public enum OrderStatus {
    PENDING,
    DEPOSIT_SUBMITTED,
    PAID_DEPOSIT,
    PREPARING,
    SHIPPING,
    DELIVERED,
    ESCROW_HOLDING,
    COMPLETED,
    CANCELLED
}
