package org.example.crm_be.module.customers.domain.repository;

import org.example.crm_be.module.customers.domain.entity.Customer;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository {

    Customer save(Customer customer);

    List<Customer> findAll();

    Optional<Customer> findById(Integer id);

    Optional<Customer> findByLeadId(Integer leadId);

    void deleteById(Integer id);
}