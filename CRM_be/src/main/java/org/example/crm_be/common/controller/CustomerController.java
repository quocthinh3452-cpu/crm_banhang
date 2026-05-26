package org.example.crm_be.common.controller;

import org.example.crm_be.common.persistence.CustomerDbEntity;
import org.example.crm_be.common.persistence.CustomerJpaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    private final CustomerJpaRepository customerJpaRepository;

    public CustomerController(CustomerJpaRepository customerJpaRepository) {
        this.customerJpaRepository = customerJpaRepository;
    }

    @GetMapping
    public List<CustomerDbEntity> getAllCustomers() {
        return customerJpaRepository.findAll();
    }
}
