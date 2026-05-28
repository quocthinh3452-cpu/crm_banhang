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
import org.example.crm_be.module.customers.contacts.presentation.dto.CustomerDashboardResponse;

import org.example.crm_be.module.customers.contacts.infrastructure.persistence.ContactJpaRepository;

import org.example.crm_be.module.customer_interactions.infrastructure.persistence.CustomerInteractionJpaRepository;

import org.example.crm_be.module.customer_documents.infrastructure.persistence.CustomerDocumentJpaRepository;

import org.example.crm_be.module.complaints.infrastructure.persistence.ComplaintJpaRepository;
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@RestController("moduleCustomerController")
public class CustomerController {

    private final CreateCustomerUseCase createCustomerUseCase;

    private final GetAllCustomersUseCase getAllCustomersUseCase;

    private final UpdateCustomerUseCase updateCustomerUseCase;

    private final DeleteCustomerUseCase deleteCustomerUseCase;

    private final ContactJpaRepository contactRepository;

    private final CustomerInteractionJpaRepository interactionRepository;

    private final CustomerDocumentJpaRepository documentRepository;

    private final ComplaintJpaRepository complaintRepository;

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
    @GetMapping("/{id}/dashboard")
    public CustomerDashboardResponse getDashboard(
            @PathVariable Long id
    ) {

        long totalContacts =
                contactRepository
                        .findByCustomerId(id)
                        .size();

        long totalInteractions =
                interactionRepository
                        .findByCustomerId(id)
                        .size();

        long totalDocuments =
                documentRepository
                        .findByCustomerId(id)
                        .size();

        long totalComplaints =
                complaintRepository
                        .findByCustomerId(id)
                        .size();

        return new CustomerDashboardResponse(
                totalContacts,
                totalInteractions,
                totalDocuments,
                totalComplaints
        );
    }
}
