package org.example.crm_be.module.product.application.usecase;

import org.example.crm_be.module.product.application.dto.input.ProductRequest;

public interface IUpdateProduct {
    void execute(Long id, ProductRequest request, String fileName);
}
