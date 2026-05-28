package org.example.crm_be.module.customer_documents.presentation.controller;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.customer_documents.domain.entity.CustomerDocument;
import org.example.crm_be.module.customer_documents.infrastructure.persistence.CustomerDocumentJpaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer-documents")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CustomerDocumentController {

    private final CustomerDocumentJpaRepository repository;

    @GetMapping("/customer/{customerId}")
    public List<CustomerDocument> getByCustomer(
            @PathVariable Long customerId
    ) {
        return repository.findByCustomerId(customerId);
    }

    @PostMapping
    public CustomerDocument create(
            @RequestBody CustomerDocument document
    ) {
        return repository.save(document);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ) {
        repository.deleteById(id);
    }
}