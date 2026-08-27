package com.shopstack.shopstack_backend.repository;

import com.shopstack.shopstack_backend.entity.Product;
import com.shopstack.shopstack_backend.entity.ProductAvailability;
import com.shopstack.shopstack_backend.entity.ProductStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Get all products belonging to a vendor
    List<Product> findByVendorId(Long vendorId);


    // Get vendor products based on availability
    List<Product> findByVendorIdAndAvailability(
            Long vendorId,
            ProductAvailability availability
    );


    // Get customer-visible products
    // APPROVED + ACTIVE + stock > 0
    List<Product> findByStatusAndAvailabilityAndStockQuantityGreaterThan(
            ProductStatus status,
            ProductAvailability availability,
            Integer stockQuantity
    );


    List<Product> findByAvailabilityAndStockQuantityGreaterThan(
        ProductAvailability availability,
        Integer stockQuantity
        );


        long countByVendorId(Long vendorId);

        long countByVendorIdAndAvailability(
                Long vendorId,
                ProductAvailability availability
        );
}