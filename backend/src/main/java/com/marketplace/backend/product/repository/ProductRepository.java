package com.marketplace.backend.product.repository;

import com.marketplace.backend.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    List<Product> findAllByOrderByCreatedAtDesc();
    long countByShopId(Long shopId);
    List<Product> findAllByShopId(Long shopId);
}
