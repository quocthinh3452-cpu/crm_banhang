package org.example.crm_be.module.customers.presentation.controller;

import lombok.RequiredArgsConstructor;

import org.example.crm_be.module.customers.application.dto.input.CreateCustomerInput;
import org.example.crm_be.module.customers.application.dto.output.CustomerOutput;

import org.example.crm_be.module.customers.application.usecase.CreateCustomerUseCase;
import org.example.crm_be.module.customers.application.usecase.GetAllCustomersUseCase;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.example.crm_be.module.customers.application.dto.input.UpdateCustomerInput;
import org.example.crm_be.module.customers.application.usecase.UpdateCustomerUseCase;

@RequestMapping("/api/customers")
@RequiredArgsConstructor
@RestController("moduleCustomerController")
public class CustomerController {

    private final CreateCustomerUseCase createCustomerUseCase;

    private final GetAllCustomersUseCase getAllCustomersUseCase;

    private final UpdateCustomerUseCase updateCustomerUseCase;

    @PostMapping
    public CustomerOutput create(
            @RequestBody CreateCustomerInput input
    ) {
        return createCustomerUseCase.execute(input);
    }

    @PutMapping("/{id}")
    public CustomerOutput update(
            @PathVariable Integer id,
            @RequestBody UpdateCustomerInput input
    ) {
        return updateCustomerUseCase.execute(id, input);
    }

    @GetMapping
    public List<CustomerOutput> getAll() {
        return getAllCustomersUseCase.execute();
    }
}