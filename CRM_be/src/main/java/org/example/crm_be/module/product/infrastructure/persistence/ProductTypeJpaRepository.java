package org.example.crm_be.module.product.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductTypeJpaRepository extends JpaRepository<ProductTypeDbEntity, Long> {
    boolean existsByTypeName(String typeName);
    @Query(value = "SELECT * FROM product_categories WHERE name = :typeName", nativeQuery = true)
    Optional<ProductTypeDbEntity> findByTypeName(@Param("typeName") String typeName);
}
