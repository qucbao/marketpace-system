package com.marketplace.backend.user.controller;

import com.marketplace.backend.common.response.ApiResponse;
import com.marketplace.backend.order.repository.OrderRepository;
import com.marketplace.backend.product.repository.ProductRepository;
import com.marketplace.backend.shop.repository.ShopRepository;
import com.marketplace.backend.user.dto.DashboardStatsResponse;
import com.marketplace.backend.user.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public AdminDashboardController(UserRepository userRepository,
                                    ShopRepository shopRepository,
                                    ProductRepository productRepository,
                                    OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStats() {
        long totalUsers = userRepository.count();
        long pendingShops = shopRepository.findByStatus(com.marketplace.backend.shop.entity.ShopStatus.PENDING).size();
        long totalOrders = orderRepository.count();
        long totalProducts = productRepository.count();
        
        // Giả sử doanh thu là 20% tiền cọc của các đơn hàng đã hoàn tất (COMPLETED) hoặc PAID_DEPOSIT?
        // Công thức: Sum(depositAmount) where status != CANCELLED and status != PENDING
        double totalRevenue = orderRepository.findAll().stream()
                .filter(o -> o.getStatus() != com.marketplace.backend.order.entity.OrderStatus.PENDING && 
                             o.getStatus() != com.marketplace.backend.order.entity.OrderStatus.CANCELLED)
                .mapToDouble(o -> o.getDepositAmount().doubleValue())
                .sum();

        DashboardStatsResponse stats = new DashboardStatsResponse(
                totalUsers,
                pendingShops,
                totalOrders,
                totalRevenue,
                totalProducts
        );
        
        return ResponseEntity.ok(ApiResponse.ok("Lấy thống kê dashboard thành công", stats));
    }
}
