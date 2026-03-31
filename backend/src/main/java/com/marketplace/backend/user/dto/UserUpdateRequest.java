package com.marketplace.backend.user.dto;

import jakarta.validation.constraints.NotBlank;

public class UserUpdateRequest {
    @NotBlank(message = "Họ và tên không được để trống")
    private String fullName;

    public UserUpdateRequest() {}

    public UserUpdateRequest(String fullName) {
        this.fullName = fullName;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
}
