package org.example.crm_be.module.product.infrastructure.persistence;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductJpaRepository extends JpaRepository<ProductDbEntity, Long> {

    Optional<ProductDbEntity> findByProductCodeIgnoreCase(String productCode);

    boolean existsByProductCode(String productCode);
    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE ProductDbEntity p SET p.isDeleted = 1 WHERE p.id = :id")
    void softDeleteProduct(@Param("id") Long id);



    // 3. Khôi phục
    Optional<ProductDbEntity> findByProductCode(String productCode);

    @Modifying(clearAutomatically = true)
    @Transactional // Đừng quên cái này để thực thi lệnh Update
    @Query("UPDATE ProductDbEntity p SET p.isDeleted = 0 WHERE p.id = :id")
    void restoreById(@Param("id") Long id);

    @Query("SELECT p FROM ProductDbEntity p WHERE p.isDeleted = 0 AND " +
            "(:keyword IS NULL OR :keyword = '' OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.productCode) LIKE LOWER(CONCAT('%', :keyword, '%')))"+
            "AND (:typeId IS NULL OR p.typeId = :typeId)")
    List<ProductDbEntity> searchAndSortProducts(@Param("keyword") String keyword, @Param("typeId") Long typeId, Sort sort);


    @Query("SELECT p FROM ProductDbEntity p WHERE " +
            "(p.isDeleted = 0 OR p.isDeleted IS NULL) AND " +
            "(:keyword IS NULL" +
            "    OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))" +
            "    OR LOWER(p.productCode) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:typeId IS NULL OR p.typeId = :typeId) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
            "(:startDate IS NULL OR p.createdAt >= :startDate) AND " +
            "(:endDate IS NULL OR p.createdAt <= :endDate)")
    Page<ProductDbEntity> searchProductsFull(
            @Param("keyword") String keyword,
            @Param("typeId") Long typeId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);
    @Query(value = "SELECT * FROM products WHERE code = :code", nativeQuery = true)
    Optional<ProductDbEntity> findByProductCodeIgnoreSoftDelete(@Param("code") String code);

}
