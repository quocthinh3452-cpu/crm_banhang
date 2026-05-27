package org.example.crm_be.common.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("commonProductJpaRepository")
public interface ProductJpaRepository extends JpaRepository<ProductDbEntity, Long> {
}
