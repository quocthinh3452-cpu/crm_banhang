package org.example.crm_be.module.product.application.usecase;

import org.example.crm_be.module.product.application.dto.output.ProductTypeResponse;

import java.util.List;

public interface IGetAllProductTypes {
    List<ProductTypeResponse> execute();
}
