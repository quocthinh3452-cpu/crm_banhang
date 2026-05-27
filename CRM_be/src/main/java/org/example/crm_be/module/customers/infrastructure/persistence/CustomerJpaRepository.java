package org.example.crm_be.module.customers.infrastructure.persistence;

import org.example.crm_be.module.customers.domain.entity.Customer;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerJpaRepository
        extends JpaRepository<Customer, Integer> {
}