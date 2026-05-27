package org.example.crm_be.common.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("commonCustomerJpaRepository")
public interface CustomerJpaRepository extends JpaRepository<CustomerDbEntity, Integer> {
}
