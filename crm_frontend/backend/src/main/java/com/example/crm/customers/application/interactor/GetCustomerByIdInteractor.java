package com.example.crm.customers.application.interactor;

import org.springframework.stereotype.Service;

import com.example.crm.customers.application.dto.CustomerOutput;
import com.example.crm.customers.application.usecase.GetCustomerByIdUseCase;
import com.example.crm.customers.domain.CustomerRepository;
import com.example.crm.customers.domain.ResourceNotFoundException;

@Service
public class GetCustomerByIdInteractor implements GetCustomerByIdUseCase {

    private final CustomerRepository customerRepository;

    public GetCustomerByIdInteractor(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public CustomerOutput getCustomerById(Long id) {
        return customerRepository.findById(id)
            .map(CustomerOutput::fromEntity)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }
}
