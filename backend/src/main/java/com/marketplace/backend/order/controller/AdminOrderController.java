package com.marketplace.backend.order.controller;

import com.marketplace.backend.common.response.ApiResponse;
import com.marketplace.backend.order.dto.OrderResponse;
import com.marketplace.backend.order.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        List<OrderResponse> response = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.ok("Tất cả đơn hàng đã được tải", response));
    }

    @PostMapping("/{id}/approve-deposit")
    public ResponseEntity<ApiResponse<OrderResponse>> approveDeposit(@PathVariable Long id) {
        OrderResponse response = orderService.approveDeposit(id);
        return ResponseEntity.ok(ApiResponse.ok("Duyệt cọc thành công", response));
    }

    @PostMapping("/{id}/release-escrow")
    public ResponseEntity<ApiResponse<OrderResponse>> releaseEscrow(@PathVariable Long id) {
        OrderResponse response = orderService.releaseEscrow(id);
        return ResponseEntity.ok(ApiResponse.ok("Giải ngân tiền thành công", response));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateStatus(@PathVariable Long id, @RequestParam String status) {
        OrderResponse response = orderService.adminUpdateOrderStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái thành công", response));
    }
}
