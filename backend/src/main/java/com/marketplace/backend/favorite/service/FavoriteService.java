package com.marketplace.backend.favorite.service;

import com.marketplace.backend.favorite.dto.FavoriteResponse;
import com.marketplace.backend.favorite.entity.Favorite;
import com.marketplace.backend.favorite.repository.FavoriteRepository;
import com.marketplace.backend.product.entity.Product;
import com.marketplace.backend.product.repository.ProductRepository;
import com.marketplace.backend.user.entity.User;
import com.marketplace.backend.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public FavoriteService(FavoriteRepository favoriteRepository, ProductRepository productRepository,
                           UserRepository userRepository) {
        this.favoriteRepository = favoriteRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public FavoriteResponse addFavorite(Long productId, Long userId) {
        Product product = getProductEntity(productId);
        User user = getUserEntity(userId);

        if (favoriteRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new IllegalArgumentException("Product is already in favorites");
        }

        Favorite favorite = new Favorite();
        favorite.setProduct(product);
        favorite.setUser(user);
        favorite.setCreatedAt(Instant.now());

        return toResponse(favoriteRepository.save(favorite));
    }

    @Transactional
    public void removeFavorite(Long productId, Long userId) {
        getUserEntity(userId);
        getProductEntity(productId);

        Favorite favorite = favoriteRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new IllegalArgumentException("Favorite not found"));

        favoriteRepository.delete(favorite);
    }

    @Transactional(readOnly = true)
    public List<FavoriteResponse> getFavoritesByUserId(Long userId) {
        getUserEntity(userId);

        return favoriteRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private Product getProductEntity(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }

    private User getUserEntity(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private FavoriteResponse toResponse(Favorite favorite) {
        return new FavoriteResponse(
                favorite.getId(),
                favorite.getUser().getId(),
                favorite.getProduct().getId(),
                favorite.getProduct().getName(),
                favorite.getCreatedAt()
        );
    }
}
