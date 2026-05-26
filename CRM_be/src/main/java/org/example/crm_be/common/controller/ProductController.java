package org.example.crm_be.common.controller;

import org.example.crm_be.common.persistence.ProductDbEntity;
import org.example.crm_be.common.persistence.ProductJpaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductJpaRepository productJpaRepository;

    public ProductController(ProductJpaRepository productJpaRepository) {
        this.productJpaRepository = productJpaRepository;
    }

    @GetMapping
    public List<ProductDbEntity> getAllProducts() {
        // Chỉ lấy những sản phẩm hoạt động (isDeleted != 1)
        return productJpaRepository.findAll().stream()
                .filter(p -> p.getIsDeleted() == null || p.getIsDeleted() != 1)
                .toList();
    }
}
