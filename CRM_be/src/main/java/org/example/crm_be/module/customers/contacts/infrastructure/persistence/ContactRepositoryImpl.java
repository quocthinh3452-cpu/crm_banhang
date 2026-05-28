package org.example.crm_be.module.customers.contacts.infrastructure.persistence;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.customers.contacts.domain.entity.Contact;
import org.example.crm_be.module.customers.contacts.domain.repository.ContactRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ContactRepositoryImpl
        implements ContactRepository {

    private final ContactJpaRepository jpaRepository;

    @Override
    public Contact save(Contact contact) {
        return jpaRepository.save(contact);
    }

    @Override
    public List<Contact> findByCustomerId(Long customerId) {
        return jpaRepository.findByCustomerId(customerId);
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
}