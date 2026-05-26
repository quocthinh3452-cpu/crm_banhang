package com.example.crm.customers.application.usecase;

import com.example.crm.customers.application.dto.CustomerListResponse;

public interface GetAllCustomersUseCase {

    CustomerListResponse getAllCustomers(
        String search,
        String type,
        String tier,
        String status,
        int page,
        int pageSize,
        String sortBy,
        String sortOrder
    );
}
