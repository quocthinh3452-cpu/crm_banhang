package com.example.crm.customers.application.interactor;

import org.springframework.stereotype.Service;

import com.example.crm.customers.application.dto.CustomerOutput;
import com.example.crm.customers.application.dto.UpdateCustomerInput;
import com.example.crm.customers.application.usecase.UpdateCustomerUseCase;
import com.example.crm.customers.domain.Customer;
import com.example.crm.customers.domain.CustomerRepository;
import com.example.crm.customers.domain.ResourceNotFoundException;

@Service
public class UpdateCustomerInteractor implements UpdateCustomerUseCase {

    private final CustomerRepository customerRepository;

    public UpdateCustomerInteractor(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public CustomerOutput updateCustomer(Long id, UpdateCustomerInput input) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        customer.setName(input.getName());
        customer.setType(input.getType());
        customer.setTier(input.getTier());
        customer.setPhone(input.getPhone());
        customer.setBudget(input.getBudget());
        customer.setEmail(input.getEmail());
        customer.setStatus(input.getStatus());

        Customer updated = customerRepository.save(customer);
        return CustomerOutput.fromEntity(updated);
    }
}
