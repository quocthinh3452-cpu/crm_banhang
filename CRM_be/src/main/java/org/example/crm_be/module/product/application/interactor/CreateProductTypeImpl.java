package org.example.crm_be.module.product.application.interactor;

import lombok.AllArgsConstructor;
import org.example.crm_be.module.product.application.dto.input.ProductTypeReqest;
import org.example.crm_be.module.product.application.mapper.ProductTypeMapper;
import org.example.crm_be.module.product.application.usecase.ICreateProductType;
import org.example.crm_be.module.product.domain.entity.ProductType;
import org.example.crm_be.module.product.domain.repository.ProductTypeRepository;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CreateProductTypeImpl implements ICreateProductType {
    private final ProductTypeRepository productTypeRepository;
    private final ProductTypeMapper productTypeMapper;



    @Override
    public void execute(ProductTypeReqest request) {
        // 1. Kiểm tra trùng lặp tên loại sản phẩm
        if (productTypeRepository.existsByTypeName(request.getTypeName())) {
            throw new IllegalArgumentException("Tên loại sản phẩm này đã tồn tại!");
        }

        // 2. Chuyển từ DTO sang Domain Entity
        ProductType type=productTypeMapper.toEntity(request);

        // 3. Lưu xuống Database
        productTypeRepository.save(type);
    }
}
