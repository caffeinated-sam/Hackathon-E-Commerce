package com.ecommerce.order.service;

import com.ecommerce.order.dto.CreateOrderRequest;
import com.ecommerce.order.dto.ProductDTO;
import com.ecommerce.order.exception.InsufficientStockException;
import com.ecommerce.order.exception.OrderNotFoundException;
import com.ecommerce.order.exception.ProductServiceException;
import com.ecommerce.order.model.Order;
import com.ecommerce.order.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${product.service.url}")
    private String productServiceUrl;

    public Order createOrder(CreateOrderRequest request) {
        logger.info("Creating order for productId: {}, quantity: {}", request.getProductId(), request.getQuantity());

        // Step 1: Validate product exists and get details
        ProductDTO product = getProductDetails(request.getProductId());

        // Step 2: Validate sufficient stock
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new InsufficientStockException(
                    String.format("Insufficient stock for product '%s'. Available: %d, Requested: %d",
                            product.getName(), product.getStockQuantity(), request.getQuantity()));
        }

        // Step 3: Calculate total price
        BigDecimal totalPrice = product.getPrice().multiply(BigDecimal.valueOf(request.getQuantity()));

        // Step 4: Build and save order
        Order order = Order.builder()
                .productId(request.getProductId())
                .productName(product.getName())
                .quantity(request.getQuantity())
                .totalPrice(totalPrice)
                .customerName(request.getCustomerName())
                .status(Order.OrderStatus.CONFIRMED)
                .build();

        Order savedOrder = orderRepository.save(order);
        logger.info("Order created successfully with id: {}", savedOrder.getId());

        // Step 5: Decrease stock in product service (best-effort)
        try {
            decreaseProductStock(request.getProductId(), request.getQuantity());
        } catch (Exception e) {
            logger.warn("Failed to decrease stock for product {}: {}", request.getProductId(), e.getMessage());
            // Order is still saved - stock sync can be handled asynchronously
        }

        return savedOrder;
    }

    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Order> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    public Order updateOrderStatus(Long id, Order.OrderStatus newStatus) {
        Order order = getOrderById(id);
        order.setStatus(newStatus);
        logger.info("Updated order {} status to {}", id, newStatus);
        return orderRepository.save(order);
    }

    private ProductDTO getProductDetails(Long productId) {
        try {
            String url = productServiceUrl + "/products/" + productId;
            ProductDTO product = restTemplate.getForObject(url, ProductDTO.class);
            if (product == null) {
                throw new ProductServiceException("Product not found with id: " + productId);
            }
            return product;
        } catch (HttpClientErrorException.NotFound e) {
            throw new ProductServiceException("Product not found with id: " + productId);
        } catch (Exception e) {
            logger.error("Failed to call product service: {}", e.getMessage());
            throw new ProductServiceException("Unable to reach product service. Please try again.");
        }
    }

    @SuppressWarnings("unchecked")
    private void decreaseProductStock(Long productId, int quantity) {
        String url = productServiceUrl + "/products/" + productId + "/stock?quantity=" + quantity;
        restTemplate.patchForObject(url, null, Map.class);
    }
}
