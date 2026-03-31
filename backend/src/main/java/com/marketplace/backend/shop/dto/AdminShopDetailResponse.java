package com.marketplace.backend.shop.dto;

import com.marketplace.backend.shop.entity.ShopStatus;
import java.time.Instant;

public class AdminShopDetailResponse extends ShopResponse {
    private String ownerEmail;
    private long totalProducts;

    public AdminShopDetailResponse() {
    }

    public AdminShopDetailResponse(Long id, String name, String description, String avatarUrl, String address, 
                                   Long ownerId, String ownerName, ShopStatus status, 
                                   Instant createdAt, Instant updatedAt) {
        super(id, name, description, avatarUrl, address, ownerId, ownerName, status, createdAt, updatedAt);
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }
}
