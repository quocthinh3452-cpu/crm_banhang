package org.example.crm_be.module.customers.contacts.infrastructure.persistence;

import org.example.crm_be.module.customers.contacts.domain.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactJpaRepository
        extends JpaRepository<Contact, Long> {

    List<Contact> findByCustomerId(Long customerId);
}