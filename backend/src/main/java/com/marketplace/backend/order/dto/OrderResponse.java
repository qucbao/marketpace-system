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
    private String depositBillUrl;
    private Instant escrowHoldAt;
    private String sellerName;
    private String sellerBankAccount;
    private String sellerBankName;
    private String buyerName;

    public OrderResponse() {
    }

    public OrderResponse(Long id, Long userId, Long shopId, String shopName, CheckoutType checkoutType,
                         OrderStatus status, BigDecimal totalAmount, BigDecimal depositAmount,
                         Instant createdAt, List<OrderItemSummary> items, String depositBillUrl, Instant escrowHoldAt,
                         String sellerName, String sellerBankAccount, String sellerBankName, String buyerName) {
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
        this.depositBillUrl = depositBillUrl;
        this.escrowHoldAt = escrowHoldAt;
        this.sellerName = sellerName;
        this.sellerBankAccount = sellerBankAccount;
        this.sellerBankName = sellerBankName;
        this.buyerName = buyerName;
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

    public String getDepositBillUrl() {
        return depositBillUrl;
    }

    public void setDepositBillUrl(String depositBillUrl) {
        this.depositBillUrl = depositBillUrl;
    }

    public Instant getEscrowHoldAt() {
        return escrowHoldAt;
    }

    public void setEscrowHoldAt(Instant escrowHoldAt) {
        this.escrowHoldAt = escrowHoldAt;
    }

    public String getSellerName() {
        return sellerName;
    }

    public void setSellerName(String sellerName) {
        this.sellerName = sellerName;
    }

    public String getSellerBankAccount() {
        return sellerBankAccount;
    }

    public void setSellerBankAccount(String sellerBankAccount) {
        this.sellerBankAccount = sellerBankAccount;
    }

    public String getSellerBankName() {
        return sellerBankName;
    }

    public void setSellerBankName(String sellerBankName) {
        this.sellerBankName = sellerBankName;
    }

    public String getBuyerName() {
        return buyerName;
    }

    public void setBuyerName(String buyerName) {
        this.buyerName = buyerName;
    }

    public static class OrderItemSummary {
        private Long productId;
        private String productName;
        private String productImage;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal lineTotal;

        public OrderItemSummary() {
        }

        public OrderItemSummary(Long productId, String productName, String productImage, Integer quantity, BigDecimal unitPrice,
                                BigDecimal lineTotal) {
            this.productId = productId;
            this.productName = productName;
            this.productImage = productImage;
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

        public String getProductImage() {
            return productImage;
        }

        public void setProductImage(String productImage) {
            this.productImage = productImage;
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
