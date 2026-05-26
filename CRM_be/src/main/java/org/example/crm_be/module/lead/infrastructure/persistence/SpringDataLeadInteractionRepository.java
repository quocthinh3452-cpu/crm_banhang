package org.example.crm_be.module.lead.infrastructure.persistence;

import org.example.crm_be.module.lead.infrastructure.persistence.entity.LeadInteractionDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SpringDataLeadInteractionRepository extends JpaRepository<LeadInteractionDbEntity, Integer> {
    // Đã sửa Long thành Integer ở JpaRepository và tham số leadId dưới đây
    List<LeadInteractionDbEntity> findByLeadIdOrderByInteractionDateDesc(Integer leadId);
}