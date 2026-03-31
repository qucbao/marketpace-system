package com.marketplace.backend.shop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ShopUpdateRequest {

    @NotBlank(message = "Tên shop không được để trống")
    @Size(max = 100, message = "Tên shop không quá 100 ký tự")
    private String name;

    @NotBlank(message = "Mô tả shop không được để trống")
    @Size(max = 500, message = "Mô tả shop không quá 500 ký tự")
    private String description;

    private String avatarUrl;
    private String address;

    public ShopUpdateRequest() {
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

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
