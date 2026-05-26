package org.example.crm_be.module.lead.domain.repository;

import org.example.crm_be.module.lead.domain.entity.LeadInteraction;
import java.util.List;

public interface LeadInteractionRepository {
    List<LeadInteraction> findByLeadId(Integer leadId); // Đã sửa từ Long thành Integer
    LeadInteraction save(LeadInteraction interaction);
}