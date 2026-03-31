package com.marketplace.backend.user.dto;

import jakarta.validation.constraints.NotBlank;

public class UserUpdateRequest {
    @NotBlank(message = "Họ và tên không được để trống")
    private String fullName;

    private String bankAccount;
    private String bankName;

    public UserUpdateRequest() {}

    public UserUpdateRequest(String fullName, String bankAccount, String bankName) {
        this.fullName = fullName;
        this.bankAccount = bankAccount;
        this.bankName = bankName;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getBankAccount() { return bankAccount; }
    public void setBankAccount(String bankAccount) { this.bankAccount = bankAccount; }

    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }
}
