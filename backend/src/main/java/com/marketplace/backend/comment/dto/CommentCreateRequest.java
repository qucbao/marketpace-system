package com.marketplace.backend.comment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CommentCreateRequest {

    @NotBlank(message = "Comment content is required")
    @Size(max = 500, message = "Comment content must be at most 500 characters")
    private String content;

    public CommentCreateRequest() {
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
