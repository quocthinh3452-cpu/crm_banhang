package com.example.crm.customers.application.interactor;

import org.springframework.stereotype.Service;

import com.example.crm.customers.application.usecase.DeleteCustomerUseCase;
import com.example.crm.customers.domain.CustomerRepository;
import com.example.crm.customers.domain.ResourceNotFoundException;

@Service
public class DeleteCustomerInteractor implements DeleteCustomerUseCase {

    private final CustomerRepository customerRepository;

    public DeleteCustomerInteractor(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public void deleteCustomer(Long id) {
        if (customerRepository.findById(id).isEmpty()) {
            throw new ResourceNotFoundException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }
}
