package org.example.crm_be.module.product.domain.service;

import org.example.crm_be.module.product.domain.repository.ProductRepository;
import org.example.crm_be.module.product.exception.ProductAlreadyExistsException;
import org.example.crm_be.module.product.exception.ProductDeletedException;
import org.springframework.stereotype.Component;

@Component
public class ProductValidator {
    private final ProductRepository productRepository;

    public ProductValidator(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public void validateUniqueness(String code) {
        productRepository.findByProductCodeIgnoreCase(code).ifPresent(p -> {
            if (p.getIsDeleted() == 0) {
                throw new ProductAlreadyExistsException(code);
            } else {
                throw new ProductDeletedException(code);
            }
        });
    }
}
