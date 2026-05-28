package org.example.crm_be.module.complaints.infrastructure.persistence;

import org.example.crm_be.module.complaints.domain.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintJpaRepository
        extends JpaRepository<Complaint, Long> {

    List<Complaint> findByCustomerId(Long customerId);
}