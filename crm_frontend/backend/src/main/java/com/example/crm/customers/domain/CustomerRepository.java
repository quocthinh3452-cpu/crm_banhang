package com.example.crm.customers.domain;

import java.util.Optional;

import com.example.crm.customers.application.dto.CustomerListResponse;

public interface CustomerRepository {

    CustomerListResponse searchCustomers(
        String search,
        String type,
        String tier,
        String status,
        int page,
        int pageSize,
        String sortBy,
        String sortOrder
    );

    Optional<Customer> findById(Long id);

    Customer save(Customer customer);

    void deleteById(Long id);
}
