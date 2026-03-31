package com.marketplace.backend.comment.controller;

import com.marketplace.backend.comment.dto.CommentCreateRequest;
import com.marketplace.backend.comment.dto.CommentResponse;
import com.marketplace.backend.comment.service.CommentService;
import com.marketplace.backend.common.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("*")

@RequestMapping("/api/products/{id}/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(@PathVariable Long id) {
        List<CommentResponse> response = commentService.getCommentsByProductId(id);
        return ResponseEntity.ok(ApiResponse.ok("Comments retrieved successfully", response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(@PathVariable Long id,
            @Valid @RequestBody CommentCreateRequest request,
            HttpServletRequest httpServletRequest) {
        CommentResponse response = commentService.createComment(id, resolveUserId(httpServletRequest), request);
        return ResponseEntity.ok(ApiResponse.ok("Comment created successfully", response));
    }

    private Long resolveUserId(HttpServletRequest request) {
        Object userId = request.getAttribute("userId");
        if (userId instanceof Number number) {
            return number.longValue();
        }
        throw new IllegalArgumentException("Authenticated user not found");
    }
}
