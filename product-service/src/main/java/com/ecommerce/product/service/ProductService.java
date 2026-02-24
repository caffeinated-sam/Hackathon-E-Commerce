package com.ecommerce.product.service;

import com.ecommerce.product.exception.ProductNotFoundException;
import com.ecommerce.product.model.Product;
import com.ecommerce.product.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProductService {

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);
    private static final String CACHE_NAME = "products";

    @Autowired
    private ProductRepository productRepository;

    @Cacheable(value = CACHE_NAME, key = "'all'")
    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        logger.info("Cache MISS - Fetching all products from database");
        return productRepository.findAll();
    }

    @Cacheable(value = CACHE_NAME, key = "#id")
    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        logger.info("Cache MISS - Fetching product {} from database", id);
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
    }

    @Cacheable(value = CACHE_NAME, key = "'instock'")
    @Transactional(readOnly = true)
    public List<Product> getProductsInStock() {
        logger.info("Cache MISS - Fetching in-stock products from database");
        return productRepository.findAllInStock();
    }

    @CacheEvict(value = CACHE_NAME, key = "'all'")
    public Product createProduct(Product product) {
        logger.info("Creating new product: {}", product.getName());
        Product saved = productRepository.save(product);
        logger.info("Product created with id: {}", saved.getId());
        return saved;
    }

    @Caching(put = { @CachePut(value = CACHE_NAME, key = "#id") }, evict = {
            @CacheEvict(value = CACHE_NAME, key = "'all'") })
    public Product updateProduct(Long id, Product updatedProduct) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
        existing.setName(updatedProduct.getName());
        existing.setDescription(updatedProduct.getDescription());
        existing.setPrice(updatedProduct.getPrice());
        existing.setStockQuantity(updatedProduct.getStockQuantity());
        logger.info("Updating product with id: {}", id);
        return productRepository.save(existing);
    }

    @Caching(evict = {
            @CacheEvict(value = CACHE_NAME, key = "#id"),
            @CacheEvict(value = CACHE_NAME, key = "'all'"),
            @CacheEvict(value = CACHE_NAME, key = "'instock'")
    })
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException("Product not found with id: " + id);
        }
        logger.info("Deleting product with id: {}", id);
        productRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Product> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    public boolean decreaseStock(Long id, int quantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + id));
        if (product.getStockQuantity() < quantity) {
            return false;
        }
        product.setStockQuantity(product.getStockQuantity() - quantity);
        productRepository.save(product);
        return true;
    }
}
