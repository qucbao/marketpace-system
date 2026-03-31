package com.marketplace.backend.shop.service;

import com.marketplace.backend.shop.dto.ShopRegisterRequest;
import com.marketplace.backend.shop.dto.ShopResponse;
import com.marketplace.backend.shop.entity.Shop;
import com.marketplace.backend.shop.entity.ShopStatus;
import com.marketplace.backend.shop.repository.ShopRepository;
import com.marketplace.backend.user.entity.User;
import com.marketplace.backend.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShopService {

    private final ShopRepository shopRepository;
    private final UserRepository userRepository;

    public ShopService(ShopRepository shopRepository, UserRepository userRepository) {
        this.shopRepository = shopRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ShopResponse register(ShopRegisterRequest request) {
        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new IllegalArgumentException("Owner user not found"));

        if (shopRepository.existsByOwnerId(owner.getId())) {
            throw new IllegalArgumentException("This user has already registered a shop");
        }

        Instant now = Instant.now();

        Shop shop = new Shop();
        shop.setName(request.getName().trim());
        shop.setDescription(request.getDescription().trim());
        shop.setOwner(owner);
        shop.setStatus(ShopStatus.PENDING);
        shop.setCreatedAt(now);
        shop.setUpdatedAt(now);

        return toResponse(shopRepository.save(shop));
    }

    @Transactional(readOnly = true)
    public ShopResponse getById(Long id) {
        Shop shop = getShopEntity(id);
        return toResponse(shop);
    }

    @Transactional
    public ShopResponse approve(Long id) {
        Shop shop = getShopEntity(id);
        shop.setStatus(ShopStatus.APPROVED);
        shop.setUpdatedAt(Instant.now());
        return toResponse(shopRepository.save(shop));
    }

    @Transactional
    public ShopResponse reject(Long id) {
        Shop shop = getShopEntity(id);
        shop.setStatus(ShopStatus.REJECTED);
        shop.setUpdatedAt(Instant.now());
        return toResponse(shopRepository.save(shop));
    }

    @Transactional(readOnly = true)
    public List<ShopResponse> getAll() {
        return shopRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private Shop getShopEntity(Long id) {
        return shopRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Shop not found"));
    }

    private ShopResponse toResponse(Shop shop) {
        return new ShopResponse(
                shop.getId(),
                shop.getName(),
                shop.getDescription(),
                shop.getOwner() != null ? shop.getOwner().getId() : 0, // Kiểm tra null
                shop.getOwner() != null ? shop.getOwner().getFullName() : "Unknown", // Kiểm tra null
                shop.getStatus(),
                shop.getCreatedAt(),
                shop.getUpdatedAt());
    }
}
