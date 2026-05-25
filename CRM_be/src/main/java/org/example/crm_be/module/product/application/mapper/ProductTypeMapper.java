package org.example.crm_be.module.product.application.mapper;

import org.example.crm_be.module.product.application.dto.input.ProductTypeReqest;
import org.example.crm_be.module.product.application.dto.output.ProductTypeResponse;
import org.example.crm_be.module.product.domain.entity.ProductType;
import org.example.crm_be.module.product.infrastructure.persistence.ProductTypeDbEntity;
import org.springframework.stereotype.Component;

@Component
public class ProductTypeMapper {
    // chứ không phải DbEntity (ProductTypeDbEntity)
    public ProductTypeResponse toResponse(ProductType domain) {
        if (domain == null) return null;
        return new ProductTypeResponse(
                domain.getId(),
                domain.getTypeName(),
                domain.getIsActive()
        );
    }
    public ProductType toEntity (ProductTypeReqest request) {
        if (request == null) return null;
        ProductType entity = new ProductType();
        entity.setTypeName(request.getTypeName());
        entity.setIsActive(request.getIsActive());
        return entity;
    }
    public ProductType toDomain(ProductTypeDbEntity dbEntity) {
        if (dbEntity == null) return null;
        ProductType domain = new ProductType();
        domain.setId(dbEntity.getId());
        domain.setTypeName(dbEntity.getTypeName());
        domain.setIsActive(dbEntity.getIsActive());
        // domain.setDescription(dbEntity.getDescription()); // Nhớ bật lại dòng này nếu có nhé
        return domain;
    }

    // Chuyển từ Domain Entity -> DB Entity
    public ProductTypeDbEntity toDbEntity(ProductType domain) {
        if (domain == null) return null;
        ProductTypeDbEntity db = new ProductTypeDbEntity();
        db.setId(domain.getId());
        db.setTypeName(domain.getTypeName());
        db.setIsActive(domain.getIsActive());
        // db.setDescription(domain.getDescription());
        return db;
    }
}
