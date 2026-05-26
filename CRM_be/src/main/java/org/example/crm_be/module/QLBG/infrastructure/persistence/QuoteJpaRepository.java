package org.example.crm_be.module.QLBG.infrastructure.persistence;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

/**
 * Interface này tận dụng sức mạnh của Spring Data JPA để thực hiện các thao tác CRUD.
 * Nó làm việc trực tiếp với QuoteDbEntity (Persistence Entity).
 */
@Repository
public interface QuoteJpaRepository extends JpaRepository<QuoteDbEntity, Integer> {

    // Tìm kiếm mã báo giá (không phân biệt hoa thường) và phân trang
    Page<QuoteDbEntity> findByQuoteNumberContainingIgnoreCase(String quoteNumber, Pageable pageable);
    Optional<QuoteDbEntity> findByQuoteNumber(String quoteNumber);

    @Query("SELECT q FROM QuoteDbEntity q WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR LOWER(q.quoteNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(q.customer.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:status IS NULL OR q.status = :status) AND " +
           "(:minTotal IS NULL OR q.total >= :minTotal) AND " +
           "(:maxTotal IS NULL OR q.total <= :maxTotal) AND " +
           "(:startDate IS NULL OR q.date >= :startDate) AND " +
           "(:endDate IS NULL OR q.date <= :endDate)")
    Page<QuoteDbEntity> searchQuotes(
            @Param("keyword") String keyword,
            @Param("status") org.example.crm_be.module.QLBG.domain.entity.QuoteStatus status,
            @Param("minTotal") BigDecimal minTotal,
            @Param("maxTotal") BigDecimal maxTotal,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );
}
