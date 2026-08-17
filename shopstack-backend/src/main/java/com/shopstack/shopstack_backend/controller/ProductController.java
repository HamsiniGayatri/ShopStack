package com.shopstack.shopstack_backend.controller;

import com.shopstack.shopstack_backend.entity.Product;
import com.shopstack.shopstack_backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:3000")

public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }


    // Add Product
    @PostMapping("/add")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.addProduct(product));
    }


    // Get All Products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }


    // Get Product By Id
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {

        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    // Get Vendor Products
    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<Product>> getVendorProducts(
            @PathVariable Long vendorId) {

        return ResponseEntity.ok(
                productService.getProductsByVendor(vendorId)
        );
    }

    @GetMapping("/available")
public ResponseEntity<List<Product>> getAvailableProducts() {

    return ResponseEntity.ok(
            productService.getAvailableProducts()
    );
}


    // Update Product
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product) {

        return ResponseEntity.ok(
                productService.updateProduct(id, product)
        );
    }


    // Delete Product
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {

        productService.deleteProduct(id);

        return ResponseEntity.ok("Product deleted successfully");
    }

    @PutMapping("/{id}/stock")
        public Product updateStock(
                @PathVariable Long id,
                @RequestBody Map<String, Integer> data) {

            return productService.updateStock(
                    id,
                    data.get("stockQuantity")
            );
        }


        @PutMapping("/{id}/price")
            public Product updatePrice(
                    @PathVariable Long id,
                    @RequestBody Product updatedProduct) {

                return productService.updatePrice(
                    id,
                    updatedProduct.getPrice().doubleValue()
                );
            }
}