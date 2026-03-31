package com.marketplace.backend.shop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ShopRegisterRequest {

    @NotNull(message = "Owner id is required")
    private Long ownerId;

    @NotBlank(message = "Shop name is required")
    @Size(max = 100, message = "Shop name must be at most 100 characters")
    private String name;

    @NotBlank(message = "Shop description is required")
    @Size(max = 500, message = "Shop description must be at most 500 characters")
    private String description;

    public ShopRegisterRequest() {
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
