package com.marketplace.backend.favorite.controller;

import com.marketplace.backend.common.response.ApiResponse;
import com.marketplace.backend.favorite.dto.FavoriteResponse;
import com.marketplace.backend.favorite.service.FavoriteService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("*")

@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping("/{productId}")
    public ResponseEntity<ApiResponse<FavoriteResponse>> addFavorite(@PathVariable Long productId,
            HttpServletRequest httpServletRequest) {
        FavoriteResponse response = favoriteService.addFavorite(productId, resolveUserId(httpServletRequest));
        return ResponseEntity.ok(ApiResponse.ok("Favorite added successfully", response));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Object>> removeFavorite(@PathVariable Long productId,
            HttpServletRequest httpServletRequest) {
        favoriteService.removeFavorite(productId, resolveUserId(httpServletRequest));
        return ResponseEntity.ok(ApiResponse.ok("Favorite removed successfully", null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getFavorites(HttpServletRequest httpServletRequest) {
        List<FavoriteResponse> response = favoriteService
                .getFavoritesByUserId(resolveUserId(httpServletRequest));
        return ResponseEntity.ok(ApiResponse.ok("Favorites retrieved successfully", response));
    }

    private Long resolveUserId(HttpServletRequest request) {
        Object userId = request.getAttribute("userId");
        if (userId instanceof Number number) {
            return number.longValue();
        }
        throw new IllegalArgumentException("Authenticated user not found");
    }
}
