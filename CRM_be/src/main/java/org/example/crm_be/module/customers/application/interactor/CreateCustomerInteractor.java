package org.example.crm_be.module.customers.application.interactor;

import lombok.RequiredArgsConstructor;

import org.example.crm_be.module.customers.application.dto.input.CreateCustomerInput;

import org.example.crm_be.module.customers.application.dto.output.CustomerOutput;

import org.example.crm_be.module.customers.application.usecase.CreateCustomerUseCase;

import org.example.crm_be.module.customers.domain.entity.Customer;

import org.example.crm_be.module.customers.domain.repository.CustomerRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor

public class CreateCustomerInteractor
        implements CreateCustomerUseCase {

    private final CustomerRepository repository;

    @Override
    public CustomerOutput execute(
            CreateCustomerInput input
    ) {
        if (input.getLeadId() != null) {
            java.util.Optional<Customer> existing = repository.findByLeadId(input.getLeadId());
            if (existing.isPresent()) {
                Customer customer = existing.get();
                return CustomerOutput.builder()
                        .id(customer.getId())
                        .customerCode(customer.getCustomerCode())
                        .name(customer.getName())
                        .type(customer.getType())
                        .tier(customer.getTier())
                        .phone(customer.getPhone())
                        .email(customer.getEmail())
                        .taxCode(customer.getTaxCode())
                        .address(customer.getAddress())
                        .status(customer.getStatus())
                        .note(customer.getNote())
                        .budget(customer.getBudget())
                        .leadId(customer.getLeadId())
                        .build();
            }
        }

        Customer customer = Customer.builder()
                .customerCode(input.getCustomerCode())
                .name(input.getName())
                .type(input.getType())
                .tier(input.getTier())
                .phone(input.getPhone())
                .email(input.getEmail())
                .taxCode(input.getTaxCode())
                .address(input.getAddress())
                .status(input.getStatus())
                .note(input.getNote())
                .budget(input.getBudget())
                .leadId(input.getLeadId())
                .createdAt(LocalDateTime.now())
                .build();

        customer = repository.save(customer);

        return CustomerOutput.builder()
                .id(customer.getId())
                .customerCode(customer.getCustomerCode())
                .name(customer.getName())
                .type(customer.getType())
                .tier(customer.getTier())
                .phone(customer.getPhone())
                .email(customer.getEmail())
                .taxCode(customer.getTaxCode())
                .address(customer.getAddress())
                .status(customer.getStatus())
                .note(customer.getNote())
                .budget(customer.getBudget())
                .leadId(customer.getLeadId())
                .build();
    }
}