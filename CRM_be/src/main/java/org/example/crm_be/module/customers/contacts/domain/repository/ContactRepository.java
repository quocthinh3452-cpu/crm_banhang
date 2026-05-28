package org.example.crm_be.module.customers.contacts.domain.repository;
import org.example.crm_be.module.customers.contacts.domain.entity.Contact;

import java.util.List;

public interface ContactRepository {

    Contact save(Contact contact);

    List<Contact> findByCustomerId(Long customerId);

    void deleteById(Long id);
}