package com.marketplace.backend.user.controller;

import com.marketplace.backend.common.response.ApiResponse;
import com.marketplace.backend.user.dto.UserResponse;
import com.marketplace.backend.user.dto.UserUpdateRequest;
import com.marketplace.backend.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    private Long extractUserId(HttpServletRequest request) {
        Object userIdObj = request.getAttribute("userId");
        if (userIdObj == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        return Long.parseLong(userIdObj.toString());
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(HttpServletRequest request) {
        Long userId = extractUserId(request);
        UserResponse response = userService.getUserProfile(userId);
        return ResponseEntity.ok(ApiResponse.ok("Lấy thông tin profile thành công", response));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            HttpServletRequest request,
            @Valid @RequestBody UserUpdateRequest updateRequest) {
        Long userId = extractUserId(request);
        UserResponse response = userService.updateUserProfile(userId, updateRequest);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật thông tin thành công", response));
    }

    @GetMapping("/admin-bank")
    public ResponseEntity<ApiResponse<UserResponse>> getAdminBank() {
        UserResponse response = userService.getAdminBankInfo();
        return ResponseEntity.ok(ApiResponse.ok("Lấy thông tin Admin thành công", response));
    }
}
