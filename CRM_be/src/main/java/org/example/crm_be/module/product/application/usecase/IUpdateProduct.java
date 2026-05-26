package org.example.crm_be.module.product.application.usecase;

import org.example.crm_be.module.product.application.dto.input.ProductRequest;
import org.example.crm_be.module.product.application.dto.output.ProductResponse;

public interface IUpdateProduct {
    ProductResponse execute(Long id, ProductRequest request, String fileName);
}
