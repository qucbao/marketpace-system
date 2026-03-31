package com.marketplace.backend.common.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseFixer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseFixer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        try {
            System.out.println(">>> CẬP NHẬT CẤU TRÚC DATABASE (USERS & SHOPS)...");
            
            // Thêm cột cho tính năng khóa tài khoản
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE");
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS lock_reason VARCHAR(255)");
            
            // Xóa các ràng buộc cũ của Orders
            jdbcTemplate.execute("ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check");
            jdbcTemplate.execute("ALTER TABLE orders DROP CONSTRAINT IF EXISTS order_status_check");
            
            // Thêm các cột mới cho Shop
            jdbcTemplate.execute("ALTER TABLE shops ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(255)");
            jdbcTemplate.execute("ALTER TABLE shops ADD COLUMN IF NOT EXISTS address VARCHAR(255)");

            // Cập nhật cho phần Review/Rating
            jdbcTemplate.execute("ALTER TABLE comments ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 5");
            jdbcTemplate.execute("ALTER TABLE comments ADD COLUMN IF NOT EXISTS image_urls VARCHAR(1000)");
            jdbcTemplate.execute("ALTER TABLE comments ADD COLUMN IF NOT EXISTS order_id BIGINT");

            jdbcTemplate.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS average_rating DOUBLE PRECISION DEFAULT 0.0");
            jdbcTemplate.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS sold_count INTEGER DEFAULT 0");
            
            // Xóa ràng buộc cũ của Shops (để hỗ trợ trạng thái LOCKED mới)
            jdbcTemplate.execute("ALTER TABLE shops DROP CONSTRAINT IF EXISTS shops_status_check");
            jdbcTemplate.execute("ALTER TABLE shops DROP CONSTRAINT IF EXISTS shop_status_check");

            System.out.println(">>> ĐÃ CẬP NHẬT DATABASE THÀNH CÔNG!");
        } catch (Exception e) {
            System.out.println(">>> LỖI KHI CẬP NHẬT DATABASE: " + e.getMessage());
        }
    }
}
