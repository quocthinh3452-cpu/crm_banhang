package org.example.crm_be.module.product.application.usecase;

import org.example.crm_be.module.product.application.dto.output.ProductResponse;
import org.example.crm_be.module.product.domain.entity.PageResult;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface IGetAllProducts {
    PageResult<ProductResponse> execute(
            int page,           // 1. Phân trang
            int size,
            String keyword,     // 2. Tìm kiếm & Lọc
            Long typeId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            LocalDateTime start,
            LocalDateTime end,
            String sortBy,      // 3. Sắp xếp
            String sortDir
    );
}
