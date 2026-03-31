package com.marketplace.backend.auth.service;

import com.marketplace.backend.auth.dto.AuthResponse;
import com.marketplace.backend.auth.dto.LoginRequest;
import com.marketplace.backend.auth.dto.RegisterRequest;
import com.marketplace.backend.security.jwt.JwtService;
import com.marketplace.backend.user.entity.Role;
import com.marketplace.backend.user.entity.User;
import com.marketplace.backend.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already in use");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());

        User newUser = new User();
        newUser.setFullName(request.getFullName().trim());
        newUser.setEmail(email);
        newUser.setPassword(hashedPassword);
        newUser.setRole(Role.USER);
        newUser.setCreatedAt(Instant.now());

        User saved = userRepository.save(newUser);

        String token = jwtService.generateToken(saved.getId(), saved.getEmail(), saved.getRole().name());

        return new AuthResponse(saved.getId(), saved.getFullName(), saved.getEmail(), saved.getRole(), token);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole(), token);
    }
}
