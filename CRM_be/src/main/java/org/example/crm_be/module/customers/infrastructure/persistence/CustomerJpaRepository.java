package org.example.crm_be.module.customers.infrastructure.persistence;

import org.example.crm_be.module.customers.domain.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerJpaRepository
        extends JpaRepository<Customer, Integer> {

    List<Customer> findByDeletedFalse();

    Optional<Customer> findByLeadId(Integer leadId);
}