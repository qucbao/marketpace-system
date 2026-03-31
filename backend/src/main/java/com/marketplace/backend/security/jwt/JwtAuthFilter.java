package com.marketplace.backend.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        // 1. Nếu không có Header hoặc không đúng định dạng Bearer
        if (header == null || !header.startsWith("Bearer ")) {
            // CHO PHÉP ĐI TIẾP sang filter tiếp theo thay vì báo lỗi 401
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {
            // 2. Nếu có token, tiến hành validate như bình thường
            Long userId = jwtService.extractUserId(token);
            String email = jwtService.extractEmail(token);
            String role = jwtService.extractRole(token);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                request.setAttribute("userId", userId);
                request.setAttribute("email", email);

                java.util.List<org.springframework.security.core.authority.SimpleGrantedAuthority> authorities = Collections.emptyList();
                if (role != null) {
                    authorities = Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + role));
                }

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        email,
                        null,
                        authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            // Chỉ khi có Token mà Token đó BỊ LỖI (hết hạn, sai chữ ký) thì mới chặn 401
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token invalid or expired");
            return;
        }

        // 3. Luôn gọi doFilter cuối cùng
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getRequestURI().startsWith("/api/auth/");
    }
}
