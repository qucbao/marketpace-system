package com.marketplace.backend.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.marketplace.backend.user.entity.Role;
import java.time.Instant;

public class UserDetailResponse extends UserResponse {
    @JsonProperty("isLocked")
    private boolean isLocked;
    private String lockReason;
    
    // Seller specific
    private String shopName;
    private Long shopId;
    private long totalProducts;

    public UserDetailResponse() {}

    public UserDetailResponse(Long id, String fullName, String email, Role role, Instant createdAt, 
                              String bankAccount, String bankName, boolean isLocked, String lockReason) {
        super(id, fullName, email, role, createdAt, bankAccount, bankName);
        this.isLocked = isLocked;
        this.lockReason = lockReason;
    }

    public boolean isLocked() { return isLocked; }
    public void setLocked(boolean locked) { isLocked = locked; }
    public String getLockReason() { return lockReason; }
    public void setLockReason(String lockReason) { this.lockReason = lockReason; }
    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }
    public Long getShopId() { return shopId; }
    public void setShopId(Long shopId) { this.shopId = shopId; }
    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }
}
