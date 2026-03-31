package com.marketplace.backend.comment.dto;

import java.time.Instant;

public class CommentResponse {

    private Long id;
    private Long productId;
    private Long userId;
    private String userName;
    private String content;
    private Instant createdAt;
    private Integer rating;
    private String imageUrls;
    private Long orderId;

    public CommentResponse() {
    }

    public CommentResponse(Long id, Long productId, Long userId, String userName, String content, Instant createdAt, Integer rating, String imageUrls, Long orderId) {
        this.id = id;
        this.productId = productId;
        this.userId = userId;
        this.userName = userName;
        this.content = content;
        this.createdAt = createdAt;
        this.rating = rating;
        this.imageUrls = imageUrls;
        this.orderId = orderId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(String imageUrls) {
        this.imageUrls = imageUrls;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
}
