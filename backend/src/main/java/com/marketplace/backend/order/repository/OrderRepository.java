package com.marketplace.backend.order.repository;

import com.marketplace.backend.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByUserIdOrderByCreatedAtDesc(Long userId);
    List<Order> findAllByShopIdOrderByCreatedAtDesc(Long shopId);
}
