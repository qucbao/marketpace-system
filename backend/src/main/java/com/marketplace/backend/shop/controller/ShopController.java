package com.marketplace.backend.shop.controller;

import com.marketplace.backend.common.response.ApiResponse;
import com.marketplace.backend.shop.dto.ShopRegisterRequest;
import com.marketplace.backend.shop.dto.ShopResponse;
import com.marketplace.backend.shop.dto.ShopUpdateRequest;
import com.marketplace.backend.shop.service.ShopService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/shops")
public class ShopController {

    private final ShopService shopService;

    public ShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    private Long extractUserId(HttpServletRequest request) {
        Object userIdObj = request.getAttribute("userId");
        if (userIdObj == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        return Long.parseLong(userIdObj.toString());
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<ShopResponse>> register(@Valid @RequestBody ShopRegisterRequest request) {
        ShopResponse response = shopService.register(request);
        return ResponseEntity.ok(ApiResponse.ok("Shop registration submitted successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ShopResponse>> getById(@PathVariable Long id) {
        ShopResponse response = shopService.getById(id);
        return ResponseEntity.ok(ApiResponse.ok("Shop retrieved successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShopResponse>>> getAll() {
        List<ShopResponse> response = shopService.getAll();
        return ResponseEntity.ok(ApiResponse.ok("Shops retrieved successfully", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ShopResponse>> getMyShop(HttpServletRequest request) {
        Long userId = extractUserId(request);
        return ResponseEntity.ok(ApiResponse.ok("My shop retrieved successfully", shopService.getByUserId(userId)));
    }

    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<ShopResponse>> updateMyShop(
            HttpServletRequest request,
            @Valid @RequestBody ShopUpdateRequest updateRequest) {
        Long userId = extractUserId(request);
        ShopResponse response = shopService.updateShop(userId, updateRequest);
        return ResponseEntity.ok(ApiResponse.ok("Shop updated successfully", response));
    }
}
