package org.example.crm_be.module.product.application.dto.output;

import java.math.BigDecimal;

public record ProductResponse(Long id, String productCode, String name, String typeName, BigDecimal price, String imageUrl,
                              String description, String createdAt, String updatedAt, Integer isDeleted) {
}
