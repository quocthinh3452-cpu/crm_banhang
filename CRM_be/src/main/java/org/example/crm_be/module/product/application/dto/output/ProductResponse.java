package org.example.crm_be.module.product.application.dto.output;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponse(
        Long id,
        String productCode,
        String name,
        String typeName,
        Long typeId,
        BigDecimal price,
        String imageUrl,
        String description,

        // Sửa từ String -> LocalDateTime và gắn format chuẩn ISO
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime createdAt,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime updatedAt,

        Integer isDeleted
) {
}
