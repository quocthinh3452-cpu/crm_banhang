package com.example.crm.customers.application.interactor;

import org.springframework.stereotype.Service;

import com.example.crm.customers.application.dto.CreateCustomerInput;
import com.example.crm.customers.application.dto.CustomerOutput;
import com.example.crm.customers.application.usecase.CreateCustomerUseCase;
import com.example.crm.customers.domain.Customer;
import com.example.crm.customers.domain.CustomerRepository;

@Service
public class CreateCustomerInteractor implements CreateCustomerUseCase {

    private final CustomerRepository customerRepository;

    public CreateCustomerInteractor(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public CustomerOutput createCustomer(CreateCustomerInput input) {
        Customer customer = new Customer();
        customer.setName(input.getName());
        customer.setType(input.getType());
        customer.setTier(input.getTier());
        customer.setPhone(input.getPhone());
        customer.setBudget(input.getBudget());
        customer.setEmail(input.getEmail());
        customer.setStatus(input.getStatus());

        Customer saved = customerRepository.save(customer);
        return CustomerOutput.fromEntity(saved);
    }
}
