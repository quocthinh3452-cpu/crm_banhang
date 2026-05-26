package org.example.crm_be.module.lead.infrastructure.persistence;

import org.example.crm_be.module.lead.infrastructure.persistence.entity.LeadDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SpringDataLeadRepository extends JpaRepository<LeadDbEntity, Integer>, JpaSpecificationExecutor<LeadDbEntity> {
}