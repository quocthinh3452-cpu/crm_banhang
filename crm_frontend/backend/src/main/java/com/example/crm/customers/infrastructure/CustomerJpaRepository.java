package com.example.crm.customers.infrastructure;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.crm.customers.domain.Customer;

@Repository
public interface CustomerJpaRepository extends JpaRepository<Customer, Long> {

    List<Customer> findAllByDeletedFalse();

    Optional<Customer> findByIdAndDeletedFalse(Long id);
}
