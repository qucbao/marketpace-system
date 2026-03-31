package com.marketplace.backend.cart.service;

import com.marketplace.backend.cart.dto.CartAddRequest;
import com.marketplace.backend.cart.dto.CartResponse;
import com.marketplace.backend.cart.entity.CartItem;
import com.marketplace.backend.cart.repository.CartRepository;
import com.marketplace.backend.product.entity.Product;
import com.marketplace.backend.product.entity.ProductStatus;
import com.marketplace.backend.product.repository.ProductRepository;
import com.marketplace.backend.user.entity.User;
import com.marketplace.backend.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, UserRepository userRepository,
                       ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<CartResponse> getCartByUserId(Long userId) {
        getUserEntity(userId);

        return cartRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CartResponse addToCart(Long userId, CartAddRequest request) {
        User user = getUserEntity(userId);
        Product product = getProductEntity(request.getProductId());
        validateProductCanBeAdded(product);

        CartItem cartItem = cartRepository.findByUserIdAndProductId(user.getId(), product.getId())
                .orElseGet(() -> createCartItem(user, product));

        if (cartItem.getId() == null) {
            cartItem.setQuantity(request.getQuantity());
        } else {
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
            cartItem.setUpdatedAt(Instant.now());
        }

        return toResponse(cartRepository.save(cartItem));
    }

    @Transactional
    public void removeCartItem(Long itemId, Long userId) {
        getUserEntity(userId);

        CartItem cartItem = cartRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only remove your own cart items");
        }

        cartRepository.delete(cartItem);
    }

    private CartItem createCartItem(User user, Product product) {
        Instant now = Instant.now();

        CartItem cartItem = new CartItem();
        cartItem.setUser(user);
        cartItem.setProduct(product);
        cartItem.setCreatedAt(now);
        cartItem.setUpdatedAt(now);
        return cartItem;
    }

    private void validateProductCanBeAdded(Product product) {
        if (product.getStatus() == ProductStatus.SOLD) {
            throw new IllegalArgumentException("Cannot add a sold product to cart");
        }
    }

    private User getUserEntity(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private Product getProductEntity(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }

    private CartResponse toResponse(CartItem cartItem) {
        BigDecimal productPrice = cartItem.getProduct().getPrice();
        BigDecimal totalPrice = productPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));

        return new CartResponse(
                cartItem.getId(),
                cartItem.getUser().getId(),
                cartItem.getProduct().getId(),
                cartItem.getProduct().getName(),
                productPrice,
                cartItem.getQuantity(),
                totalPrice,
                cartItem.getCreatedAt(),
                cartItem.getUpdatedAt()
        );
    }
}
