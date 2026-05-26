package com.example.crm.customers.application.interactor;

import org.springframework.stereotype.Service;

import com.example.crm.customers.application.dto.CustomerListResponse;
import com.example.crm.customers.application.usecase.GetAllCustomersUseCase;
import com.example.crm.customers.domain.CustomerRepository;

@Service
public class GetAllCustomersInteractor implements GetAllCustomersUseCase {

    private final CustomerRepository customerRepository;

    public GetAllCustomersInteractor(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public CustomerListResponse getAllCustomers(
        String search,
        String type,
        String tier,
        String status,
        int page,
        int pageSize,
        String sortBy,
        String sortOrder
    ) {
        return customerRepository.searchCustomers(
            search,
            type,
            tier,
            status,
            page,
            pageSize,
            sortBy,
            sortOrder
        );
    }
}
