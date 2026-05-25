package org.example.crm_be.module.product.application.usecase;

import org.example.crm_be.module.product.application.dto.input.ProductTypeReqest;

public interface ICreateProductType {
    void execute(ProductTypeReqest request);
}
