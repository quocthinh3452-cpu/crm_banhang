package org.example.crm_be.module.customers.infrastructure.persistence;

import lombok.RequiredArgsConstructor;

import org.example.crm_be.module.customers.domain.entity.Customer;

import org.example.crm_be.module.customers.domain.repository.CustomerRepository;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor

public class CustomerRepositoryImpl
        implements CustomerRepository {

    private final CustomerJpaRepository jpaRepository;

    @Override
    public Customer save(Customer customer) {
        return jpaRepository.save(customer);
    }

    @Override
    public List<Customer> findAll() {
        return jpaRepository.findAll();
    }

    @Override
    public Optional<Customer> findById(Integer id) {
        return jpaRepository.findById(id);
    }

    @Override
    public Optional<Customer> findByLeadId(Integer leadId) {
        return jpaRepository.findByLeadId(leadId);
    }

    @Override
    public void deleteById(Integer id) {
        jpaRepository.deleteById(id);
    }
}