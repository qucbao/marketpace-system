package com.marketplace.backend.cart.controller;

import com.marketplace.backend.cart.dto.CartAddRequest;
import com.marketplace.backend.cart.dto.CartResponse;
import com.marketplace.backend.cart.service.CartService;
import com.marketplace.backend.common.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CartResponse>>> getCart(HttpServletRequest httpServletRequest) {
        List<CartResponse> response = cartService.getCartByUserId(resolveUserId(httpServletRequest));
        return ResponseEntity.ok(ApiResponse.ok("Cart retrieved successfully", response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(@Valid @RequestBody CartAddRequest request,
            HttpServletRequest httpServletRequest) {
        CartResponse response = cartService.addToCart(resolveUserId(httpServletRequest), request);
        return ResponseEntity.ok(ApiResponse.ok("Product added to cart successfully", response));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<ApiResponse<Object>> removeCartItem(@PathVariable Long itemId,
            HttpServletRequest httpServletRequest) {
        cartService.removeCartItem(itemId, resolveUserId(httpServletRequest));
        return ResponseEntity.ok(ApiResponse.ok("Cart item removed successfully", null));
    }

    private Long resolveUserId(HttpServletRequest request) {
        Object userId = request.getAttribute("userId");
        if (userId instanceof Number number) {
            return number.longValue();
        }
        throw new IllegalArgumentException("Authenticated user not found");
    }
}
