package org.example.crm_be.module.customer_interactions.presentation.controller;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.customer_interactions.domain.entity.CustomerInteraction;
import org.example.crm_be.module.customer_interactions.infrastructure.persistence.CustomerInteractionJpaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interactions")
@RequiredArgsConstructor
public class CustomerInteractionController {

    private final CustomerInteractionJpaRepository repository;

    @GetMapping("/customer/{customerId}")
    public List<CustomerInteraction> getByCustomer(
            @PathVariable Long customerId
    ) {
        return repository.findByCustomerId(customerId);
    }

    @PostMapping
    public CustomerInteraction create(
            @RequestBody CustomerInteraction interaction
    ) {
        return repository.save(interaction);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ) {
        repository.deleteById(id);
    }
}