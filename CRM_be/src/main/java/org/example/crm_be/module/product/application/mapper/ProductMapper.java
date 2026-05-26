package org.example.crm_be.module.product.application.mapper;

import org.example.crm_be.module.product.application.dto.input.ProductRequest;
import org.example.crm_be.module.product.application.dto.output.ProductResponse;
import org.example.crm_be.module.product.domain.entity.Product;
import org.example.crm_be.module.product.infrastructure.persistence.ProductDbEntity;

import java.time.format.DateTimeFormatter;

public class ProductMapper {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    /**
     * Chuyển từ Request DTO (người dùng gửi lên) sang Domain Entity (để xử lý nghiệp vụ)
     */
    public Product toEntity(ProductRequest dto) {
        // Logic mapping thủ công hoặc dùng thư viện
        if (dto == null) return null;

        Product product = new Product();
        product.setId(dto.getId());
        product.setImageUrl(dto.getImageUrl());
        product.setProductCode(dto.getProductCode());
        product.setTypeId(dto.getTypeId());
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setDescription(dto.getDescription());

        // Mặc định khi tạo mới
        product.setIsDeleted(0);

        return product;
    }
    /**
     * Chuyển từ Domain Entity sang Response DTO (để trả về cho Client)
     */
    public ProductResponse toResponse(Product entity) {
        if (entity == null) return null;

        return new ProductResponse(
                entity.getId(),
                entity.getProductCode(),
                entity.getName(),
                entity.getTypeName(),
                entity.getTypeId(),
                entity.getPrice(),
                entity.getImageUrl(),
                entity.getDescription(),
                entity.getCreatedAt(), // Truyền thẳng kiểu LocalDateTime
                entity.getUpdatedAt(), // Truyền thẳng kiểu LocalDateTime
                entity.getIsDeleted()
        );
    }
    public ProductDbEntity mapToDb(Product product) {
        if (product == null) return null;
        ProductDbEntity db = new ProductDbEntity();
        db.setId(product.getId());
        db.setProductCode(product.getProductCode());
        db.setTypeId(product.getTypeId());
        db.setName(product.getName());
        db.setPrice(product.getPrice());
        db.setImageUrl(product.getImageUrl());
        db.setDescription(product.getDescription());
        db.setIsDeleted(product.getIsDeleted());
        // createdAt và updatedAt sẽ được Hibernate tự sinh nhờ @CreationTimestamp
        return db;
    }

    public Product mapToDomain(ProductDbEntity db) {
        if (db == null) return null;
        Product domain = new Product();
        domain.setId(db.getId());
        domain.setProductCode(db.getProductCode());
        domain.setTypeId(db.getTypeId());
        if (db.getProductType() != null) {
            domain.setTypeName(db.getProductType().getTypeName());
        } else {
            domain.setTypeName("Chưa phân loại");
        }
        domain.setName(db.getName());
        domain.setPrice(db.getPrice());
        domain.setImageUrl(db.getImageUrl());
        domain.setDescription(db.getDescription());
        domain.setIsDeleted(db.getIsDeleted());
        domain.setCreatedAt(db.getCreatedAt());
        domain.setUpdatedAt(db.getUpdatedAt());
        return domain;
    }
    /**
     * Cập nhật dữ liệu từ Request vào Entity có sẵn (Dùng cho UPDATE)
     */
    public void updateEntityFromRequest(ProductRequest dto, Product product) {
        if (dto == null || product == null) return;

        // Chỉ cập nhật những trường cơ bản, bỏ qua ID và ImageUrl (xử lý riêng)
        product.setProductCode(dto.getProductCode());
        product.setName(dto.getName());
        product.setTypeId(dto.getTypeId());
        product.setPrice(dto.getPrice());
        product.setDescription(dto.getDescription());
        // Trạng thái deletedAt và createdAt thường không đổi khi update thông tin
    }

}
