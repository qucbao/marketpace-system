package com.marketplace.backend.shop.controller;

import com.marketplace.backend.common.response.ApiResponse;
import com.marketplace.backend.shop.dto.ShopRegisterRequest;
import com.marketplace.backend.shop.dto.ShopResponse;
import com.marketplace.backend.shop.service.ShopService;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")

@RequestMapping("/api/shops")
public class ShopController {

    private final ShopService shopService;

    public ShopController(ShopService shopService) {
        this.shopService = shopService;
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
}
