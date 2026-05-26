package org.example.crm_be.module.QLHD.infrastructure.persistence;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;

@Repository
public interface ContractJpaRepository extends JpaRepository<ContractDbEntity, Integer> {

    @Query("SELECT c FROM ContractDbEntity c WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR LOWER(c.contractNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.customer.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:minValue IS NULL OR c.value >= :minValue) AND " +
           "(:maxValue IS NULL OR c.value <= :maxValue) AND " +
           "(:startDate IS NULL OR c.signDate >= :startDate) AND " +
           "(:endDate IS NULL OR c.signDate <= :endDate) AND " +
           "(:status IS NULL OR :status = '' OR " +
           "  (:status = 'active' AND c.status = 'active' AND (c.expiryDate IS NULL OR c.expiryDate > :thirtyDaysAhead)) OR " +
           "  (:status = 'expiring_soon' AND c.status = 'active' AND c.expiryDate >= :today AND c.expiryDate <= :thirtyDaysAhead) OR " +
           "  (:status = 'expired' AND (c.status = 'expired' OR (c.status = 'active' AND c.expiryDate < :today))) OR " +
           "  (:status = 'cancelled' AND c.status = 'cancelled')" +
           ")")
    Page<ContractDbEntity> searchContracts(
            @Param("keyword") String keyword,
            @Param("status") String status,
            @Param("minValue") BigDecimal minValue,
            @Param("maxValue") BigDecimal maxValue,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("today") LocalDate today,
            @Param("thirtyDaysAhead") LocalDate thirtyDaysAhead,
            Pageable pageable
    );
}
