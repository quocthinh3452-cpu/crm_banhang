package org.example.crm_be.module.customer_documents.infrastructure.persistence;

import org.example.crm_be.module.customer_documents.domain.entity.CustomerDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerDocumentJpaRepository
        extends JpaRepository<CustomerDocument, Long> {

    List<CustomerDocument> findByCustomerId(Long customerId);
}