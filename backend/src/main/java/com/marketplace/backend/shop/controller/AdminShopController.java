package com.marketplace.backend.shop.controller;

import com.marketplace.backend.common.response.ApiResponse;
import com.marketplace.backend.shop.dto.AdminShopDetailResponse;
import com.marketplace.backend.shop.dto.ShopResponse;
import com.marketplace.backend.shop.service.ShopService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/admin/shops")
public class AdminShopController {

    private final ShopService shopService;

    public AdminShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AdminShopDetailResponse>>> getAllShops() {
        return ResponseEntity.ok(ApiResponse.ok("All shops retrieved successfully", shopService.getAllShopsDetail()));
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<ShopResponse>>> getPendingShops() {
        return ResponseEntity.ok(ApiResponse.ok("Pending shops retrieved successfully", shopService.getPendingShops()));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<ShopResponse>> approve(@PathVariable Long id) {
        ShopResponse response = shopService.approve(id);
        return ResponseEntity.ok(ApiResponse.ok("Shop approved successfully", response));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<ShopResponse>> reject(@PathVariable Long id) {
        ShopResponse response = shopService.reject(id);
        return ResponseEntity.ok(ApiResponse.ok("Shop rejected successfully", response));
    }
}
