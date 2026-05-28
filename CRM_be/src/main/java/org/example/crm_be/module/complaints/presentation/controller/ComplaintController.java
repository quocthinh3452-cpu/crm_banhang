package org.example.crm_be.module.complaints.presentation.controller;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.complaints.domain.entity.Complaint;
import org.example.crm_be.module.complaints.infrastructure.persistence.ComplaintJpaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ComplaintController {

    private final ComplaintJpaRepository repository;

    @GetMapping("/customer/{customerId}")
    public List<Complaint> getByCustomer(
            @PathVariable Long customerId
    ) {
        return repository.findByCustomerId(customerId);
    }

    @PostMapping
    public Complaint create(
            @RequestBody Complaint complaint
    ) {
        return repository.save(complaint);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ) {
        repository.deleteById(id);
    }
}