package com.marketplace.backend.comment.service;

import com.marketplace.backend.comment.dto.CommentCreateRequest;
import com.marketplace.backend.comment.dto.CommentResponse;
import com.marketplace.backend.comment.entity.Comment;
import com.marketplace.backend.comment.repository.CommentRepository;
import com.marketplace.backend.order.entity.Order;
import com.marketplace.backend.order.entity.OrderStatus;
import com.marketplace.backend.order.repository.OrderRepository;
import com.marketplace.backend.product.entity.Product;
import com.marketplace.backend.product.repository.ProductRepository;
import com.marketplace.backend.user.entity.User;
import com.marketplace.backend.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public CommentService(CommentRepository commentRepository, ProductRepository productRepository,
                          UserRepository userRepository, OrderRepository orderRepository) {
        this.commentRepository = commentRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByProductId(Long productId) {
        validateProductExists(productId);

        return commentRepository.findAllByProductIdOrderByCreatedAtAsc(productId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CommentResponse createComment(Long productId, Long userId, CommentCreateRequest request) {
        Product product = getProductEntity(productId);
        User user = getUserEntity(userId);

        // 1. Kiểm tra đơn hàng hợp lệ (Delivered hoặc Completed)
        List<Order> validOrders = orderRepository.findAllByUserIdAndStatusAndItemsProductId(userId, OrderStatus.DELIVERED, productId);
        validOrders.addAll(orderRepository.findAllByUserIdAndStatusAndItemsProductId(userId, OrderStatus.COMPLETED, productId));

        if (validOrders.isEmpty()) {
            throw new IllegalArgumentException("Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua và nhận hàng thành công.");
        }

        // 2. Kiểm tra xem OrderId này đã được đánh giá chưa
        if (request.getOrderId() == null) {
            // Nếu không cung cấp OrderId, ta tự tìm một đơn chưa đánh giá (nếu có)
            Order unreviewedOrder = validOrders.stream()
                .filter(o -> !commentRepository.existsByOrderId(o.getId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Mỗi lượt mua hàng chỉ được đánh giá một lần. Bạn đã đánh giá hết các đơn hàng cho sản phẩm này."));
            request.setOrderId(unreviewedOrder.getId());
        } else {
            // Nếu có provide OrderId, kiểm tra tính hợp lệ
            boolean isValidOrder = validOrders.stream().anyMatch(o -> o.getId().equals(request.getOrderId()));
            if (!isValidOrder) {
                throw new IllegalArgumentException("Mã đơn hàng không hợp lệ cho sản phẩm này.");
            }
            if (commentRepository.existsByOrderId(request.getOrderId())) {
                throw new IllegalArgumentException("Đơn hàng này đã được bạn đánh giá trước đó.");
            }
        }

        // 3. Lưu đánh giá
        Comment comment = new Comment();
        comment.setProduct(product);
        comment.setUser(user);
        comment.setContent(request.getContent().trim());
        comment.setRating(request.getRating() != null ? request.getRating() : 5);
        comment.setImageUrls(request.getImageUrls());
        comment.setOrderId(request.getOrderId());
        comment.setCreatedAt(Instant.now());

        Comment saved = commentRepository.save(comment);

        // 4. Cập nhật averageRating của Product
        updateProductRating(product);

        return toResponse(saved);
    }

    private void updateProductRating(Product product) {
        List<Comment> comments = commentRepository.findAllByProductIdOrderByCreatedAtAsc(product.getId());
        if (comments.isEmpty()) {
            product.setAverageRating(0.0);
        } else {
            double average = comments.stream()
                .mapToInt(Comment::getRating)
                .average()
                .orElse(0.0);
            // Làm tròn 1 chữ số thập phân
            product.setAverageRating(Math.round(average * 10.0) / 10.0);
        }
        productRepository.save(product);
    }

    private void validateProductExists(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new IllegalArgumentException("Product not found");
        }
    }

    private Product getProductEntity(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }

    private User getUserEntity(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private CommentResponse toResponse(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getProduct().getId(),
                comment.getUser().getId(),
                comment.getUser().getFullName(),
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getRating(),
                comment.getImageUrls(),
                comment.getOrderId()
        );
    }
}
