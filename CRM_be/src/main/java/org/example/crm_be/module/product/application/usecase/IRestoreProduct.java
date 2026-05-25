package org.example.crm_be.module.product.application.usecase;

import org.example.crm_be.module.product.application.dto.output.ProductResponse;

public interface IRestoreProduct {
    ProductResponse execute(String productCode);
}
