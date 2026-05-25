package org.example.crm_be.module.product.domain.repository;

import org.example.crm_be.module.product.domain.entity.PageResult;
import org.example.crm_be.module.product.domain.entity.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ProductRepository {
    // Cơ bản
    Product save(Product product);

    Optional<Product> findById(Long id);

    List<Product> findAll();

    boolean existsByProductCode(String code);

    Optional<Product> findByProductCode(String code);

    // Nghiệp vụ Xóa mềm & Khôi phục
    void softDelete(Long id);

    void restore(Long id);

    List<Product> searchAndSort(String keyword, Long typeId, String sortField, String sortDir);

    PageResult<Product> getProducts(
            int page, int size, String keyword, Long typeId,
            BigDecimal minPrice, BigDecimal maxPrice,
            LocalDateTime start, LocalDateTime end,
            String sortBy, String sortDir
    );

    // Kiểm tra và Tìm kiếm đặc thù
    Optional<Product> findByProductCodeIgnoreCase(String productCode);
    Optional<Product> findByProductCodeIgnoreSoftDelete(String code);
}
