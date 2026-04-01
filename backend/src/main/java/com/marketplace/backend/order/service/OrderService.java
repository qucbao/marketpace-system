package com.marketplace.backend.order.service;

import com.marketplace.backend.cart.entity.CartItem;
import com.marketplace.backend.cart.repository.CartRepository;
import com.marketplace.backend.order.dto.CheckoutRequest;
import com.marketplace.backend.order.dto.OrderResponse;
import com.marketplace.backend.order.entity.CheckoutType;
import com.marketplace.backend.order.entity.Order;
import com.marketplace.backend.order.entity.OrderItem;
import com.marketplace.backend.order.entity.OrderStatus;
import com.marketplace.backend.order.repository.OrderRepository;
import com.marketplace.backend.product.entity.Product;
import com.marketplace.backend.product.entity.ProductStatus;
import com.marketplace.backend.product.repository.ProductRepository;
import com.marketplace.backend.shop.entity.Shop;
import com.marketplace.backend.user.entity.User;
import com.marketplace.backend.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Service
public class OrderService {

    private static final BigDecimal DELIVERY_DEPOSIT_RATE = new BigDecimal("0.20");

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final com.marketplace.backend.comment.repository.CommentRepository commentRepository;

    public OrderService(OrderRepository orderRepository, CartRepository cartRepository, UserRepository userRepository,
                        ProductRepository productRepository, com.marketplace.backend.comment.repository.CommentRepository commentRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.commentRepository = commentRepository;
    }

    @Transactional
    public OrderResponse checkout(Long userId, CheckoutRequest request) {
        User user = getUserEntity(userId);
        List<CartItem> cartItems = cartRepository.findAllByUserIdOrderByCreatedAtDesc(user.getId());

        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        validateCartItems(cartItems);

        Shop shop = cartItems.get(0).getProduct().getShop();
        BigDecimal totalAmount = calculateTotalAmount(cartItems);
        BigDecimal depositAmount = calculateDepositAmount(request.getCheckoutType(), totalAmount);
        OrderStatus status = determineStatus(request.getCheckoutType());

        Order order = new Order();
        order.setUser(user);
        order.setShop(shop);
        order.setCheckoutType(request.getCheckoutType());
        order.setStatus(status);
        order.setTotalAmount(totalAmount);
        order.setDepositAmount(depositAmount);
        order.setCreatedAt(Instant.now());

        List<OrderItem> orderItems = cartItems.stream()
                .map(cartItem -> createOrderItem(order, cartItem))
                .toList();
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            product.setStock(product.getStock() - cartItem.getQuantity());
            int currentSoldCount = (product.getSoldCount() != null) ? product.getSoldCount() : 0;
            product.setSoldCount(currentSoldCount + cartItem.getQuantity());
            if (product.getStock() <= 0) {
                product.setStatus(ProductStatus.SOLD);
            }
            product.setUpdatedAt(Instant.now());
            productRepository.save(product);
        }

        cartRepository.deleteAll(cartItems);

        return toResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByUserId(Long userId) {
        getUserEntity(userId);

        return orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        return toResponse(getOrderEntity(id));
    }

    private void validateCartItems(List<CartItem> cartItems) {
        Long shopId = cartItems.get(0).getProduct().getShop().getId();

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();

            if (product.getStatus() == ProductStatus.SOLD || product.getStock() < cartItem.getQuantity()) {
                throw new IllegalArgumentException("Sản phẩm '" + product.getName() + "' đã hết hàng hoặc không đủ tồn kho");
            }

            if (!product.getShop().getId().equals(shopId)) {
                throw new IllegalArgumentException("All cart items must belong to the same shop");
            }
        }
    }

    private BigDecimal calculateTotalAmount(List<CartItem> cartItems) {
        return cartItems.stream()
                .map(cartItem -> cartItem.getProduct().getPrice()
                        .multiply(BigDecimal.valueOf(cartItem.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateDepositAmount(CheckoutType checkoutType, BigDecimal totalAmount) {
        if (checkoutType == CheckoutType.DELIVERY) {
            return totalAmount.multiply(DELIVERY_DEPOSIT_RATE);
        }
        return BigDecimal.ZERO;
    }

    private OrderStatus determineStatus(CheckoutType checkoutType) {
        if (checkoutType == CheckoutType.DELIVERY) {
            return OrderStatus.PENDING;
        }
        return OrderStatus.PAID_DEPOSIT; // Pickup don't need deposit, so mark as "deposit paid"
    }

    private OrderItem createOrderItem(Order order, CartItem cartItem) {
        BigDecimal unitPrice = cartItem.getProduct().getPrice();
        BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(cartItem.getProduct());
        orderItem.setQuantity(cartItem.getQuantity());
        orderItem.setUnitPrice(unitPrice);
        orderItem.setLineTotal(lineTotal);
        return orderItem;
    }

    private User getUserEntity(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private Order getOrderEntity(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderResponse.OrderItemSummary> items = order.getItems()
                .stream()
                .map(item -> new OrderResponse.OrderItemSummary(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getImages().isEmpty() ? null : item.getProduct().getImages().get(0).getImageUrl(),
                        item.getQuantity(),
                        item.getUnitPrice(),
                        item.getLineTotal()
                ))
                .toList();

        User seller = (order.getShop() != null) ? order.getShop().getOwner() : null;

        return new OrderResponse(
                order.getId(),
                order.getUser().getId(),
                order.getShop().getId(),
                order.getShop().getName(),
                order.getCheckoutType(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getDepositAmount(),
                order.getCreatedAt(),
                items,
                order.getDepositBillUrl(),
                order.getEscrowHoldAt(),
                seller != null ? seller.getFullName() : "Unknown",
                seller != null ? seller.getBankAccount() : null,
                seller != null ? seller.getBankName() : null,
                order.getUser().getFullName()
        );
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByShopId(Long shopId) {
        return orderRepository.findAllByShopIdOrderByCreatedAtDesc(shopId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public OrderResponse submitDepositBill(Long orderId, Long userId, String billUrl) {
        Order order = getOrderEntity(orderId);
        if (!order.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You don't own this order");
        }
        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.DEPOSIT_SUBMITTED) {
            throw new IllegalStateException("Đơn hàng đang ở trạng thái không thể nộp bill: " + order.getStatus());
        }
        
        order.setDepositBillUrl(billUrl);
        order.setStatus(OrderStatus.DEPOSIT_SUBMITTED);
        return toResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse approveDeposit(Long orderId) {
        Order order = getOrderEntity(orderId);
        if (order.getStatus() != OrderStatus.DEPOSIT_SUBMITTED) {
            throw new IllegalStateException("Order has no deposit bill submitted");
        }
        
        order.setStatus(OrderStatus.PAID_DEPOSIT);
        return toResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse confirmDelivery(Long orderId, Long userId) {
        Order order = getOrderEntity(orderId);
        // Buyer or Admin can confirm delivery
        // Check if user is buyer or admin (simplified for now as userId check)
        
        if (order.getStatus() != OrderStatus.DELIVERED && order.getStatus() != OrderStatus.SHIPPING) {
            throw new IllegalStateException("Order cannot be confirmed yet");
        }

        order.setStatus(OrderStatus.ESCROW_HOLDING);
        order.setEscrowHoldAt(Instant.now());
        return toResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse releaseEscrow(Long orderId) {
        Order order = getOrderEntity(orderId);
        if (order.getStatus() != OrderStatus.ESCROW_HOLDING) {
            throw new IllegalStateException("Order is not in ESCROW_HOLDING status");
        }
        
        order.setStatus(OrderStatus.COMPLETED);
        return toResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse updateSellerOrderStatus(Long orderId, Long shopId, OrderStatus newStatus) {
        Order order = getOrderEntity(orderId);
        
        if (!order.getShop().getId().equals(shopId)) {
            throw new IllegalArgumentException("Seller cannot update orders from other shops");
        }

        // Seller only allowed to set PREPARING, SHIPPING
        if (newStatus != OrderStatus.PREPARING && newStatus != OrderStatus.SHIPPING && newStatus != OrderStatus.CANCELLED) {
             throw new IllegalArgumentException("Invalid status update for seller. Only PREPARING or SHIPPING allowed.");
        }

        // Nếu trạng thái mới là CANCELLED, hoàn lại hàng về tồn kho
        if (newStatus == OrderStatus.CANCELLED && order.getStatus() != OrderStatus.CANCELLED) {
            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();
                product.setStock(product.getStock() + item.getQuantity());
                int currentSoldCount = (product.getSoldCount() != null) ? product.getSoldCount() : 0;
                product.setSoldCount(Math.max(0, currentSoldCount - item.getQuantity()));
                if (product.getStatus() == ProductStatus.SOLD) {
                    product.setStatus(ProductStatus.ACTIVE);
                }
                product.setUpdatedAt(Instant.now());
                productRepository.save(product);
            }
        }
        
        order.setStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);
        return toResponse(updatedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getEligibleOrdersToReview(Long userId, Long productId) {
        // Tìm các đơn hàng DELIVERED hoặc COMPLETED của User này chứa Product này
        List<Order> orders = orderRepository.findAllByUserIdAndStatusAndItemsProductId(userId, OrderStatus.DELIVERED, productId);
        orders.addAll(orderRepository.findAllByUserIdAndStatusAndItemsProductId(userId, OrderStatus.COMPLETED, productId));

        // Lọc ra các đơn chưa có comment/review nào linked (mỗi đơn hàng chỉ được đánh giá 1 lần)
        return orders.stream()
                .filter(o -> !commentRepository.existsByOrderId(o.getId()))
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public OrderResponse adminUpdateOrderStatus(Long orderId, String statusName) {
        Order order = getOrderEntity(orderId);
        OrderStatus status = OrderStatus.valueOf(statusName);
        order.setStatus(status);
        return toResponse(orderRepository.save(order));
    }
}
