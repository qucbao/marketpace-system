package com.marketplace.backend.user.service;

import com.marketplace.backend.user.dto.UserResponse;
import com.marketplace.backend.user.dto.UserUpdateRequest;
import com.marketplace.backend.user.dto.UserDetailResponse;
import com.marketplace.backend.user.entity.User;
import com.marketplace.backend.user.entity.Role;
import com.marketplace.backend.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final com.marketplace.backend.shop.repository.ShopRepository shopRepository;
    private final com.marketplace.backend.product.repository.ProductRepository productRepository;

    public UserService(UserRepository userRepository,
                       com.marketplace.backend.shop.repository.ShopRepository shopRepository,
                       com.marketplace.backend.product.repository.ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public UserResponse getUserProfile(Long userId) {
        User user = getUserEntity(userId);
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt(),
                user.getBankAccount(),
                user.getBankName()
        );
    }

    @Transactional
    public UserResponse updateUserProfile(Long userId, UserUpdateRequest request) {
        User user = getUserEntity(userId);
        
        // Update only full name. Email and Role are not editable by user directly.
        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
        }

        user.setBankAccount(request.getBankAccount());
        user.setBankName(request.getBankName());
        
        User updated = userRepository.save(user);
        return new UserResponse(
                updated.getId(),
                updated.getFullName(),
                updated.getEmail(),
                updated.getRole(),
                updated.getCreatedAt(),
                updated.getBankAccount(),
                updated.getBankName()
        );
    }

    @Transactional(readOnly = true)
    public UserResponse getAdminBankInfo() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == com.marketplace.backend.user.entity.Role.ADMIN)
                .findFirst()
                .map(u -> new UserResponse(
                        u.getId(),
                        u.getFullName(),
                        u.getEmail(),
                        u.getRole(),
                        u.getCreatedAt(),
                        u.getBankAccount(),
                        u.getBankName()
                ))
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin quản trị viên"));
    }

    private User getUserEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Khách hàng không tồn tại"));
    }

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt(),
                user.getBankAccount(),
                user.getBankName()
        );
    }

    @Transactional(readOnly = true)
    public List<UserDetailResponse> getAllUsersDetail() {
        return userRepository.findAll().stream()
                .map(user -> {
                    UserDetailResponse detail = new UserDetailResponse(
                            user.getId(), user.getFullName(), user.getEmail(), user.getRole(), user.getCreatedAt(),
                            user.getBankAccount(), user.getBankName(), user.isLocked(), user.getLockReason()
                    );
                    
                    if (user.getRole() == Role.SELLER) {
                        shopRepository.findByOwnerId(user.getId()).ifPresent(shop -> {
                            detail.setShopId(shop.getId());
                            detail.setShopName(shop.getName());
                            detail.setTotalProducts(productRepository.countByShopId(shop.getId()));
                        });
                    }
                    return detail;
                })
                .toList();
    }

    @Transactional
    public UserResponse lockUser(Long id, String reason) {
        User user = getUserEntity(id);
        user.setLocked(true);
        user.setLockReason(reason);
        
        // Cascading Lock
        shopRepository.findByOwnerId(id).ifPresent(shop -> {
            shop.setStatus(com.marketplace.backend.shop.entity.ShopStatus.LOCKED);
            shopRepository.save(shop);
            
            // Hide all products
            var products = productRepository.findAllByShopId(shop.getId());
            products.forEach(p -> p.setStatus(com.marketplace.backend.product.entity.ProductStatus.HIDDEN));
            productRepository.saveAll(products);
        });
        
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse unlockUser(Long id) {
        User user = getUserEntity(id);
        user.setLocked(false);
        user.setLockReason(null);
        
        // Cascading Unlock
        shopRepository.findByOwnerId(id).ifPresent(shop -> {
            shop.setStatus(com.marketplace.backend.shop.entity.ShopStatus.APPROVED);
            shopRepository.save(shop);
            
            // Show products again
            var products = productRepository.findAllByShopId(shop.getId());
            products.forEach(p -> p.setStatus(com.marketplace.backend.product.entity.ProductStatus.ACTIVE));
            productRepository.saveAll(products);
        });
        
        return toResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id) {
        shopRepository.findByOwnerId(id).ifPresent(shop -> {
            var products = productRepository.findAllByShopId(shop.getId());
            productRepository.deleteAll(products);
            shopRepository.delete(shop);
        });
        userRepository.deleteById(id);
    }
}
