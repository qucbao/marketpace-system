package com.marketplace.backend.user.controller;

import com.marketplace.backend.common.response.ApiResponse;
import com.marketplace.backend.user.dto.UserDetailResponse;
import com.marketplace.backend.user.dto.UserResponse;
import com.marketplace.backend.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDetailResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách người dùng thành công", userService.getAllUsersDetail()));
    }

    @PatchMapping("/{id}/lock")
    public ResponseEntity<ApiResponse<UserResponse>> lockUser(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String reason = body.getOrDefault("reason", "Vi phạm chính sách");
        return ResponseEntity.ok(ApiResponse.ok("Đã khóa tài khoản thành công", userService.lockUser(id, reason)));
    }

    @PatchMapping("/{id}/unlock")
    public ResponseEntity<ApiResponse<UserResponse>> unlockUser(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Đã mở khóa tài khoản thành công", userService.unlockUser(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.ok("Xóa người dùng thành công", null));
    }
}
