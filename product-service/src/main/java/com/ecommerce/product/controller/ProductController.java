package com.ecommerce.product.controller;

import com.ecommerce.product.model.Product;
import com.ecommerce.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
@Tag(name = "Product API", description = "CRUD operations for products with Redis caching")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    @Operation(summary = "Get all products", description = "Returns all products. Response is cached in Redis.")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Returns a specific product by ID. Cached individually.")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/in-stock")
    @Operation(summary = "Get in-stock products", description = "Returns all products with stock > 0")
    public ResponseEntity<List<Product>> getInStockProducts() {
        return ResponseEntity.ok(productService.getProductsInStock());
    }

    @GetMapping("/search")
    @Operation(summary = "Search products by name")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String name) {
        return ResponseEntity.ok(productService.searchProducts(name));
    }

    @PostMapping
    @Operation(summary = "Create a new product", description = "Creates a product and invalidates the cache")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        Product created = productService.createProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a product", description = "Updates an existing product and refreshes cache entry")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id,
            @Valid @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product", description = "Deletes a product and evicts it from cache")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(Map.of("message", "Product " + id + " deleted successfully"));
    }

    @PatchMapping("/{id}/stock")
    @Operation(summary = "Decrease product stock (used by order service)")
    public ResponseEntity<Map<String, Object>> decreaseStock(@PathVariable Long id,
            @RequestParam int quantity) {
        boolean success = productService.decreaseStock(id, quantity);
        if (success) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Stock updated"));
        }
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("success", false, "message", "Insufficient stock"));
    }
}
