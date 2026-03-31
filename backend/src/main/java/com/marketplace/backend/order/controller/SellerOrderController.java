package com.marketplace.backend.order.controller;

import com.marketplace.backend.common.response.ApiResponse;
import com.marketplace.backend.order.dto.OrderResponse;
import com.marketplace.backend.order.entity.OrderStatus;
import com.marketplace.backend.order.service.OrderService;
import com.marketplace.backend.shop.entity.Shop;
import com.marketplace.backend.shop.repository.ShopRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/seller/orders")
public class SellerOrderController {

    private final OrderService orderService;
    private final ShopRepository shopRepository;

    public SellerOrderController(OrderService orderService, ShopRepository shopRepository) {
        this.orderService = orderService;
        this.shopRepository = shopRepository;
    }

    private Long getUserId(HttpServletRequest request) {
        Object userIdObj = request.getAttribute("userId");
        if (userIdObj == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        return Long.parseLong(userIdObj.toString());
    }

    private Shop getSellerShop(Long userId) {
        return shopRepository.findAll().stream()
                .filter(shop -> shop.getOwner().getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Seller does not have an active shop"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getSellerOrders(HttpServletRequest request) {
        Long userId = getUserId(request);
        Shop shop = getSellerShop(userId);
        
        List<OrderResponse> orders = orderService.getOrdersByShopId(shop.getId());
        return ResponseEntity.ok(ApiResponse.ok("Seller orders retrieved successfully", orders));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            HttpServletRequest request) {
        
        Long userId = getUserId(request);
        Shop shop = getSellerShop(userId);
        
        String newStatusStr = payload.get("status");
        if (newStatusStr == null) {
            throw new IllegalArgumentException("Status is required");
        }
        
        OrderStatus newStatus = OrderStatus.valueOf(newStatusStr.toUpperCase());
        OrderResponse response = orderService.updateSellerOrderStatus(id, shop.getId(), newStatus);
        
        return ResponseEntity.ok(ApiResponse.ok("Order status updated successfully", response));
    }
}
