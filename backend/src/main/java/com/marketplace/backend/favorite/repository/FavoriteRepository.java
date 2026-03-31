package com.marketplace.backend.favorite.repository;

import com.marketplace.backend.favorite.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    boolean existsByUserIdAndProductId(Long userId, Long productId);

    Optional<Favorite> findByUserIdAndProductId(Long userId, Long productId);

    List<Favorite> findAllByUserIdOrderByCreatedAtDesc(Long userId);
}
