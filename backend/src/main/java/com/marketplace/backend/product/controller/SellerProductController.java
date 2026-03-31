package com.marketplace.backend.product.controller;

import com.marketplace.backend.common.response.ApiResponse;
import com.marketplace.backend.product.dto.ProductCreateRequest;
import com.marketplace.backend.product.dto.ProductResponse;
import com.marketplace.backend.product.dto.ProductUpdateRequest;
import com.marketplace.backend.product.service.ProductService;
import com.marketplace.backend.shop.entity.Shop;
import com.marketplace.backend.shop.repository.ShopRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/seller/products")
public class SellerProductController {

    private final ProductService productService;
    private final ShopRepository shopRepository;

    public SellerProductController(ProductService productService, ShopRepository shopRepository) {
        this.productService = productService;
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
        // Find shop by ownerId. Assuming a user only has 1 shop in MVP.
        return shopRepository.findAll().stream()
                .filter(shop -> shop.getOwner().getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Seller does not have an active shop"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getSellerProducts(HttpServletRequest httpServletRequest) {
        Long userId = getUserId(httpServletRequest);
        Shop shop = getSellerShop(userId);
        
        // This is a bit inefficient for MVP but works: filter all products by shopId
        // Ideally, we add getProductsByShopId in ProductService.
        List<ProductResponse> allProducts = productService.getAllProducts();
        List<ProductResponse> sellerProducts = allProducts.stream()
                .filter(p -> p.getShopId().equals(shop.getId()))
                .toList();
                
        return ResponseEntity.ok(ApiResponse.ok("Seller products retrieved successfully", sellerProducts));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @Valid @RequestBody ProductCreateRequest request,
            HttpServletRequest httpServletRequest) {
        
        Long userId = getUserId(httpServletRequest);
        Shop shop = getSellerShop(userId);
        
        // Set implicit values based on authenticated SELLER
        request.setOwnerId(userId);
        request.setShopId(shop.getId());

        ProductResponse response = productService.createProduct(request);
        return ResponseEntity.ok(ApiResponse.ok("Product created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateRequest request,
            HttpServletRequest httpServletRequest) {
            
        Long userId = getUserId(httpServletRequest);
        request.setOwnerId(userId);
        
        ProductResponse response = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Product updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteProduct(
            @PathVariable Long id,
            HttpServletRequest httpServletRequest) {
            
        Long userId = getUserId(httpServletRequest);
        productService.deleteProduct(id, userId);
        return ResponseEntity.ok(ApiResponse.ok("Product deleted successfully", null));
    }
}
