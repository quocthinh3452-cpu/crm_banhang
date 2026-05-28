package org.example.crm_be.module.customer_interactions.infrastructure.persistence;

import org.example.crm_be.module.customer_interactions.domain.entity.CustomerInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerInteractionJpaRepository
        extends JpaRepository<CustomerInteraction, Long> {

    List<CustomerInteraction> findByCustomerId(Long customerId);
}