package com.marketplace.backend.order.dto;

import com.marketplace.backend.order.entity.CheckoutType;
import com.marketplace.backend.order.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class OrderResponse {

    private Long id;
    private Long userId;
    private Long shopId;
    private String shopName;
    private CheckoutType checkoutType;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private BigDecimal depositAmount;
    private Instant createdAt;
    private List<OrderItemSummary> items;

    public OrderResponse() {
    }

    public OrderResponse(Long id, Long userId, Long shopId, String shopName, CheckoutType checkoutType,
                         OrderStatus status, BigDecimal totalAmount, BigDecimal depositAmount,
                         Instant createdAt, List<OrderItemSummary> items) {
        this.id = id;
        this.userId = userId;
        this.shopId = shopId;
        this.shopName = shopName;
        this.checkoutType = checkoutType;
        this.status = status;
        this.totalAmount = totalAmount;
        this.depositAmount = depositAmount;
        this.createdAt = createdAt;
        this.items = items;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public CheckoutType getCheckoutType() {
        return checkoutType;
    }

    public void setCheckoutType(CheckoutType checkoutType) {
        this.checkoutType = checkoutType;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getDepositAmount() {
        return depositAmount;
    }

    public void setDepositAmount(BigDecimal depositAmount) {
        this.depositAmount = depositAmount;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public List<OrderItemSummary> getItems() {
        return items;
    }

    public void setItems(List<OrderItemSummary> items) {
        this.items = items;
    }

    public static class OrderItemSummary {
        private Long productId;
        private String productName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal lineTotal;

        public OrderItemSummary() {
        }

        public OrderItemSummary(Long productId, String productName, Integer quantity, BigDecimal unitPrice,
                                BigDecimal lineTotal) {
            this.productId = productId;
            this.productName = productName;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
            this.lineTotal = lineTotal;
        }

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public String getProductName() {
            return productName;
        }

        public void setProductName(String productName) {
            this.productName = productName;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public BigDecimal getUnitPrice() {
            return unitPrice;
        }

        public void setUnitPrice(BigDecimal unitPrice) {
            this.unitPrice = unitPrice;
        }

        public BigDecimal getLineTotal() {
            return lineTotal;
        }

        public void setLineTotal(BigDecimal lineTotal) {
            this.lineTotal = lineTotal;
        }
    }
}
