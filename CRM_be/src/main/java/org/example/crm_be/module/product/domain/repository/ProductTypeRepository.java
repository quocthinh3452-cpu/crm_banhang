package org.example.crm_be.module.product.domain.repository;

import org.example.crm_be.module.product.domain.entity.ProductType;

import java.util.List;
import java.util.Optional;

public interface ProductTypeRepository {
    boolean existsByTypeName(String typeName);

    // Hàm lưu loại sản phẩm
    ProductType save(ProductType productType);
    List<ProductType> findAll();
    Optional<ProductType> findById(Long id);
    void deleteById(Long id);
    Optional<ProductType> findByTypeName(String typeName);
}
