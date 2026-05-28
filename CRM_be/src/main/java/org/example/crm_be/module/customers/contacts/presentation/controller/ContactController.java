package org.example.crm_be.module.customers.contacts.presentation.controller;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.customers.contacts.domain.entity.Contact;
import org.example.crm_be.module.customers.contacts.infrastructure.persistence.ContactJpaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactJpaRepository repository;

    @GetMapping("/customer/{customerId}")
    public List<Contact> getByCustomer(
            @PathVariable Long customerId
    ) {
        return repository.findByCustomerId(customerId);
    }

    @PostMapping
    public Contact create(
            @RequestBody Contact contact
    ) {
        return repository.save(contact);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ) {
        repository.deleteById(id);
    }
}