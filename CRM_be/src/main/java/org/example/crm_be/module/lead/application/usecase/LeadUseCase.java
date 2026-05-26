package org.example.crm_be.module.lead.application.usecase;

import org.example.crm_be.module.lead.application.dto.input.*;
import org.example.crm_be.module.lead.application.dto.output.*;
import org.springframework.data.domain.Page;

import java.util.List;

public interface LeadUseCase {
    Page<LeadOutput> searchLeads(LeadSearchRequest request);
    LeadOutput getLeadDetail(Integer id); // Đã sửa sang Integer
    LeadOutput createLead(LeadCreateInput input);
    LeadOutput updateLead(Integer id, LeadUpdateInput input); // Đã sửa sang Integer
    void deleteLead(Integer id); // Đã sửa sang Integer

    LeadInteractionOutput logInteraction(Integer leadId, LeadInteractionInput input); // Đã sửa sang Integer
    List<LeadInteractionOutput> getInteractions(Integer leadId); // Đã sửa sang Integer
}