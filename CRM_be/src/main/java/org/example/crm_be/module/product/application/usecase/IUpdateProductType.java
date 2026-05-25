package org.example.crm_be.module.product.application.usecase;

import org.example.crm_be.module.product.application.dto.input.ProductTypeReqest;
import org.example.crm_be.module.product.application.dto.output.ProductTypeResponse;

public interface IUpdateProductType {
    ProductTypeResponse execute(Long id, ProductTypeReqest request);
}
