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
import org.example.crm_be.module.customers.application.usecase.DeleteCustomerUseCase;
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@RestController("moduleCustomerController")
public class CustomerController {

    private final CreateCustomerUseCase createCustomerUseCase;

    private final GetAllCustomersUseCase getAllCustomersUseCase;

    private final UpdateCustomerUseCase updateCustomerUseCase;

    private final DeleteCustomerUseCase deleteCustomerUseCase;

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

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Integer id
    ) {
        deleteCustomerUseCase.execute(id);
    }
    @GetMapping
    public List<CustomerOutput> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String tier,
            @RequestParam(required = false) String status
    ) {
        return getAllCustomersUseCase.execute(search, type, tier, status);
    }
}