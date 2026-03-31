package com.marketplace.backend.user.dto;

import com.marketplace.backend.user.entity.Role;
import java.time.Instant;

public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private Instant createdAt;
    private String bankAccount;
    private String bankName;

    public UserResponse() {}

    public UserResponse(Long id, String fullName, String email, Role role, Instant createdAt, String bankAccount, String bankName) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
        this.bankAccount = bankAccount;
        this.bankName = bankName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public String getBankAccount() { return bankAccount; }
    public void setBankAccount(String bankAccount) { this.bankAccount = bankAccount; }
    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }
}
