package org.example.crm_be.module.product.application.usecase;

import org.example.crm_be.module.product.domain.entity.Product;

import java.util.Optional;

public interface IFindProductById {
    Optional<Product> execute(Long id);
}
