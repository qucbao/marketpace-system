package com.marketplace.backend.comment.service;

import com.marketplace.backend.comment.dto.CommentCreateRequest;
import com.marketplace.backend.comment.dto.CommentResponse;
import com.marketplace.backend.comment.entity.Comment;
import com.marketplace.backend.comment.repository.CommentRepository;
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

    public CommentService(CommentRepository commentRepository, ProductRepository productRepository,
                          UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
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

        Comment comment = new Comment();
        comment.setProduct(product);
        comment.setUser(user);
        comment.setContent(request.getContent().trim());
        comment.setCreatedAt(Instant.now());

        return toResponse(commentRepository.save(comment));
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
                comment.getCreatedAt()
        );
    }
}
