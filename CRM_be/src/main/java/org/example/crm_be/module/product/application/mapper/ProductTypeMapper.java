package org.example.crm_be.module.product.application.mapper;

import org.example.crm_be.module.product.application.dto.input.ProductTypeReqest;
import org.example.crm_be.module.product.application.dto.output.ProductTypeResponse;
import org.example.crm_be.module.product.domain.entity.ProductType;
import org.example.crm_be.module.product.infrastructure.persistence.ProductTypeDbEntity;
import org.springframework.stereotype.Component;

@Component
public class ProductTypeMapper {

    // 1. Chuyển từ Domain Entity -> Response DTO (Trả về cho UI)
    public ProductTypeResponse toResponse(ProductType domain) {
        if (domain == null) return null;
        return new ProductTypeResponse(
                domain.getId(),
                domain.getTypeName(),
                domain.getIsActive()
        );
    }

    // 2. Chuyển từ Request DTO -> Domain Entity (Nhận từ UI)
    public ProductType toEntity(ProductTypeReqest request) {
        if (request == null) return null;
        ProductType entity = new ProductType();

        // BỔ SUNG: Map thêm ID vì trong DTO của bạn có trường id
        if (request.getId() != null) {
            entity.setId(request.getId());
        }

        entity.setTypeName(request.getTypeName());
        entity.setIsActive(request.getIsActive());
        return entity;
    }

    // 3. Chuyển từ DB Entity -> Domain Entity (Lấy từ Database lên)
    public ProductType toDomain(ProductTypeDbEntity dbEntity) {
        if (dbEntity == null) return null;
        ProductType domain = new ProductType();
        domain.setId(dbEntity.getId());
        domain.setTypeName(dbEntity.getTypeName());
        domain.setIsActive(dbEntity.getIsActive());

        // domain.setDescription(dbEntity.getDescription()); // Bật lại nếu entity có
        return domain;
    }

    // 4. Chuyển từ Domain Entity -> DB Entity (Chuẩn bị lưu xuống Database)
    public ProductTypeDbEntity toDbEntity(ProductType domain) {
        if (domain == null) return null;
        ProductTypeDbEntity db = new ProductTypeDbEntity();
        db.setId(domain.getId());
        db.setTypeName(domain.getTypeName());
        db.setIsActive(domain.getIsActive());

        // db.setDescription(domain.getDescription()); // Bật lại nếu entity có
        return db;
    }
}