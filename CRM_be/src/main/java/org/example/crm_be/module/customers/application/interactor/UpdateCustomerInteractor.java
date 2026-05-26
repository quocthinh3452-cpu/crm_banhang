package org.example.crm_be.module.customers.application.interactor;

import lombok.RequiredArgsConstructor;

import org.example.crm_be.module.customers.application.dto.input.UpdateCustomerInput;
import org.example.crm_be.module.customers.application.dto.output.CustomerOutput;
import org.example.crm_be.module.customers.application.usecase.UpdateCustomerUseCase;
import org.example.crm_be.module.customers.domain.entity.Customer;
import org.example.crm_be.module.customers.domain.repository.CustomerRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UpdateCustomerInteractor
        implements UpdateCustomerUseCase {

    private final CustomerRepository repository;

    @Override
    public CustomerOutput execute(
            Long id,
            UpdateCustomerInput input
    ) {

        Customer customer = repository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        customer.setCustomerCode(input.getCustomerCode());
        customer.setName(input.getName());
        customer.setType(input.getType());
        customer.setTier(input.getTier());
        customer.setPhone(input.getPhone());
        customer.setEmail(input.getEmail());
        customer.setTaxCode(input.getTaxCode());
        customer.setAddress(input.getAddress());
        customer.setStatus(input.getStatus());
        customer.setNote(input.getNote());
        customer.setBudget(input.getBudget());

        customer.setUpdatedAt(LocalDateTime.now());

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
                .build();
    }
}