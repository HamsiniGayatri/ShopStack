package com.shopstack.shopstack_backend.service;

import com.shopstack.shopstack_backend.entity.Product;
import com.shopstack.shopstack_backend.entity.ProductAvailability;
import com.shopstack.shopstack_backend.entity.ProductStatus;
import com.shopstack.shopstack_backend.entity.User;
import com.shopstack.shopstack_backend.repository.ProductRepository;
import com.shopstack.shopstack_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductService(ProductRepository productRepository,
                           UserRepository userRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }


    // =========================================================
    // Add Product
    // =========================================================

    public Product addProduct(Product product) {

        if (product.getVendor() != null &&
                product.getVendor().getId() != null) {

            User vendor = userRepository.findById(
                    product.getVendor().getId()
            ).orElseThrow(() ->
                    new RuntimeException("Vendor not found"));

            product.setVendor(vendor);
        }

        // New product starts as PENDING
        if (product.getStatus() == null) {
            product.setStatus(ProductStatus.PENDING);
        }

        // New product is available
        if (product.getAvailability() == null) {
            product.setAvailability(ProductAvailability.ACTIVE);
        }

        return productRepository.save(product);
    }


    // =========================================================
    // Get All Products
    // =========================================================

    public List<Product> getAllProducts() {

        return productRepository.findAll();
    }


    // =========================================================
    // Get Available Products For Customers
    //
    // APPROVED
    // + ACTIVE
    // + STOCK > 0
    // =========================================================

    public List<Product> getAvailableProducts() {

    return productRepository
            .findByAvailabilityAndStockQuantityGreaterThan(
                    ProductAvailability.ACTIVE,
                    0
            );
}


    // =========================================================
    // Get Product By ID
    // =========================================================

    public Optional<Product> getProductById(Long id) {

        return productRepository.findById(id);
    }


    // =========================================================
    // Get Vendor Products
    // Only ACTIVE products
    // =========================================================

    public List<Product> getProductsByVendor(Long vendorId) {

        return productRepository.findByVendorIdAndAvailability(
                vendorId,
                ProductAvailability.ACTIVE
        );
    }


    // =========================================================
    // Update Product
    // =========================================================

    public Product updateProduct(
            Long id,
            Product updatedProduct) {

        Product existingProduct =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                ));

        existingProduct.setProductName(
                updatedProduct.getProductName()
        );

        existingProduct.setCategory(
                updatedProduct.getCategory()
        );

        existingProduct.setBrand(
                updatedProduct.getBrand()
        );

        existingProduct.setDescription(
                updatedProduct.getDescription()
        );

        existingProduct.setPrice(
                updatedProduct.getPrice()
        );

        existingProduct.setStockQuantity(
                updatedProduct.getStockQuantity()
        );

        existingProduct.setImageUrl(
                updatedProduct.getImageUrl()
        );

        return productRepository.save(existingProduct);
    }


    // =========================================================
    // Soft Delete Product
    //
    // Product remains in database
    // Existing orders remain safe
    // Product disappears from vendor/customer listings
    // =========================================================

    public void deleteProduct(Long id) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                ));

        product.setAvailability(
                ProductAvailability.INACTIVE
        );

        productRepository.save(product);
    }


    // =========================================================
    // Update Stock
    // =========================================================

    public Product updateStock(
            Long id,
            Integer stockQuantity) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                ));

        product.setStockQuantity(stockQuantity);

        return productRepository.save(product);
    }


    // =========================================================
    // Update Price
    // =========================================================

    public Product updatePrice(
            Long id,
            Double price) {

        Product product =
                productRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                ));

        product.setPrice(
                BigDecimal.valueOf(price)
        );

        return productRepository.save(product);
    }


    // =========================================================
    // Reduce Stock
    // =========================================================

    public Product reduceStock(
            Long productId,
            Integer quantity) {

        Product product =
                productRepository.findById(productId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                ));

        int currentStock =
                product.getStockQuantity();

        if (currentStock < quantity) {

            throw new RuntimeException(
                    "Insufficient stock for product: "
                            + product.getProductName()
            );
        }

        product.setStockQuantity(
                currentStock - quantity
        );

        return productRepository.save(product);
    }


    // =========================================================
    // Increase Stock
    // =========================================================

    public Product increaseStock(
            Long productId,
            Integer quantity) {

        Product product =
                productRepository.findById(productId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                ));

        product.setStockQuantity(
                product.getStockQuantity() + quantity
        );

        return productRepository.save(product);
    }
}