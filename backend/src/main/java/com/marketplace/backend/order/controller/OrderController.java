package com.marketplace.backend.order.controller;

import com.marketplace.backend.common.response.ApiResponse;
import com.marketplace.backend.order.dto.CheckoutRequest;
import com.marketplace.backend.order.dto.OrderResponse;
import com.marketplace.backend.order.service.OrderService;
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

@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<OrderResponse>> checkout(@Valid @RequestBody CheckoutRequest request,
            HttpServletRequest httpServletRequest) {
        OrderResponse response = orderService.checkout(resolveUserId(httpServletRequest), request);
        return ResponseEntity.ok(ApiResponse.ok("Checkout completed successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrders(HttpServletRequest httpServletRequest) {
        List<OrderResponse> response = orderService.getOrdersByUserId(resolveUserId(httpServletRequest));
        return ResponseEntity.ok(ApiResponse.ok("Orders retrieved successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        OrderResponse response = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.ok("Order retrieved successfully", response));
    }

    private Long resolveUserId(HttpServletRequest request) {
        Object userId = request.getAttribute("userId");
        if (userId instanceof Number number) {
            return number.longValue();
        }
        throw new IllegalArgumentException("Authenticated user not found");
    }
}
