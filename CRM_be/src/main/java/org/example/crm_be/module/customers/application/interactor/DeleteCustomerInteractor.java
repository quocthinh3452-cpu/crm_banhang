package org.example.crm_be.module.customers.application.interactor;

import lombok.RequiredArgsConstructor;

import org.example.crm_be.module.customers.application.usecase.DeleteCustomerUseCase;

import org.example.crm_be.module.customers.domain.entity.Customer;
import org.example.crm_be.module.customers.domain.repository.CustomerRepository;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class DeleteCustomerInteractor
        implements DeleteCustomerUseCase {

    private final CustomerRepository repository;

    @Override
    public void execute(Integer id) {

        Customer customer = repository.findById(id)
                .orElseThrow();

        customer.setDeleted(true);

        repository.save(customer);
    }
}