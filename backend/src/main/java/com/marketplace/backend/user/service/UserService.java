package com.marketplace.backend.user.service;

import com.marketplace.backend.user.dto.UserResponse;
import com.marketplace.backend.user.dto.UserUpdateRequest;
import com.marketplace.backend.user.entity.User;
import com.marketplace.backend.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserResponse getUserProfile(Long userId) {
        User user = getUserEntity(userId);
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }

    @Transactional
    public UserResponse updateUserProfile(Long userId, UserUpdateRequest request) {
        User user = getUserEntity(userId);
        
        // Update only full name. Email and Role are not editable by user directly.
        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
        }
        
        User updated = userRepository.save(user);
        return new UserResponse(
                updated.getId(),
                updated.getFullName(),
                updated.getEmail(),
                updated.getRole(),
                updated.getCreatedAt()
        );
    }

    private User getUserEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Khách hàng không tồn tại"));
    }
}
