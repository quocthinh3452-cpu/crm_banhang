package com.example.crm.customers.presentation;

import java.net.URI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.crm.customers.application.dto.CreateCustomerInput;
import com.example.crm.customers.application.dto.CustomerListResponse;
import com.example.crm.customers.application.dto.CustomerOutput;
import com.example.crm.customers.application.dto.UpdateCustomerInput;
import com.example.crm.customers.application.usecase.CreateCustomerUseCase;
import com.example.crm.customers.application.usecase.DeleteCustomerUseCase;
import com.example.crm.customers.application.usecase.GetAllCustomersUseCase;
import com.example.crm.customers.application.usecase.GetCustomerByIdUseCase;
import com.example.crm.customers.application.usecase.UpdateCustomerUseCase;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CreateCustomerUseCase createCustomerUseCase;
    private final GetAllCustomersUseCase getAllCustomersUseCase;
    private final GetCustomerByIdUseCase getCustomerByIdUseCase;
    private final UpdateCustomerUseCase updateCustomerUseCase;
    private final DeleteCustomerUseCase deleteCustomerUseCase;

    public CustomerController(
        CreateCustomerUseCase createCustomerUseCase,
        GetAllCustomersUseCase getAllCustomersUseCase,
        GetCustomerByIdUseCase getCustomerByIdUseCase,
        UpdateCustomerUseCase updateCustomerUseCase,
        DeleteCustomerUseCase deleteCustomerUseCase
    ) {
        this.createCustomerUseCase = createCustomerUseCase;
        this.getAllCustomersUseCase = getAllCustomersUseCase;
        this.getCustomerByIdUseCase = getCustomerByIdUseCase;
        this.updateCustomerUseCase = updateCustomerUseCase;
        this.deleteCustomerUseCase = deleteCustomerUseCase;
    }

    @PostMapping
    public ResponseEntity<CustomerOutput> createCustomer(
        @RequestBody CreateCustomerInput input
    ) {
        CustomerOutput output = createCustomerUseCase.createCustomer(input);
        return ResponseEntity.created(
            URI.create("/api/customers/" + output.getId())
        ).body(output);
    }

    @GetMapping
    public ResponseEntity<CustomerListResponse> getAllCustomers(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String type,
        @RequestParam(required = false) String tier,
        @RequestParam(required = false) String status,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int pageSize,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String sortOrder
    ) {
        return ResponseEntity.ok(
            getAllCustomersUseCase.getAllCustomers(
                search,
                type,
                tier,
                status,
                page,
                pageSize,
                sortBy,
                sortOrder
            )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerOutput> getCustomerById(
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(
            getCustomerByIdUseCase.getCustomerById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerOutput> updateCustomer(
        @PathVariable Long id,
        @RequestBody UpdateCustomerInput input
    ) {
        CustomerOutput updated = updateCustomerUseCase.updateCustomer(id, input);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(
        @PathVariable Long id
    ) {
        deleteCustomerUseCase.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}
