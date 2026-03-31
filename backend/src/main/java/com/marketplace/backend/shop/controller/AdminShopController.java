package com.marketplace.backend.shop.controller;

import com.marketplace.backend.common.response.ApiResponse;
import com.marketplace.backend.shop.dto.ShopResponse;
import com.marketplace.backend.shop.service.ShopService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")

@RequestMapping("/api/admin/shops")
public class AdminShopController {

    private final ShopService shopService;

    public AdminShopController(ShopService shopService) {
        this.shopService = shopService;
    }

    @org.springframework.web.bind.annotation.GetMapping("/pending")
    public ResponseEntity<ApiResponse<java.util.List<ShopResponse>>> getPendingShops() {
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
