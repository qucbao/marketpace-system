package com.marketplace.backend.common;

import com.marketplace.backend.common.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/migration")
public class MigrationController {

    private final jakarta.persistence.EntityManager entityManager;

    public MigrationController(jakarta.persistence.EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @GetMapping("/fix-null-sold-count")
    @Transactional
    public ResponseEntity<ApiResponse<String>> fixNullSoldCount() {
        int soldCountUpdated = entityManager.createNativeQuery("UPDATE products SET sold_count = 0 WHERE sold_count IS NULL").executeUpdate();
        int ratingUpdated = entityManager.createNativeQuery("UPDATE products SET average_rating = 0.0 WHERE average_rating IS NULL").executeUpdate();
        
        return ResponseEntity.ok(ApiResponse.ok("Dã hoàn thành cập nhật " + soldCountUpdated + " dòng lượt bán và " + ratingUpdated + " dòng dánh giá.", null));
    }
}
