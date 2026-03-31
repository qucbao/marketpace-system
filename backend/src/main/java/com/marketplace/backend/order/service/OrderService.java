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

    public OrderService(OrderRepository orderRepository, CartRepository cartRepository, UserRepository userRepository,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
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
            product.setStatus(ProductStatus.SOLD);
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

            if (product.getStatus() == ProductStatus.SOLD) {
                throw new IllegalArgumentException("Cannot checkout cart with sold products");
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
            return OrderStatus.PAID_DEPOSIT;
        }
        return OrderStatus.COMPLETED;
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
                        item.getQuantity(),
                        item.getUnitPrice(),
                        item.getLineTotal()
                ))
                .toList();

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
                items
        );
    }
}
