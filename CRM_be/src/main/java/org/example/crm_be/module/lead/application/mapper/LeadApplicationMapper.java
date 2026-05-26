package org.example.crm_be.module.lead.application.mapper;

import org.example.crm_be.module.lead.domain.entity.Lead;
import org.example.crm_be.module.lead.domain.entity.LeadInteraction;
import org.example.crm_be.module.lead.application.dto.output.LeadOutput;
import org.example.crm_be.module.lead.application.dto.output.LeadInteractionOutput;
import org.springframework.stereotype.Component;

@Component
public class LeadApplicationMapper {

    public LeadOutput toOutput(Lead lead) {
        if (lead == null) return null;

        LeadOutput out = new LeadOutput();
        out.setId(lead.getId());
        out.setName(lead.getName());
        out.setCompany(lead.getCompany());
        out.setPhone(lead.getPhone());
        out.setEmail(lead.getEmail());
        out.setExpectedRevenue(lead.getExpectedRevenue());
        out.setTaxCode(lead.getTaxCode());
        out.setIdCard(lead.getIdCard());
        out.setProvinceId(lead.getProvinceId());
        out.setSourceId(lead.getSourceId());
        out.setSalesGroupId(lead.getSalesGroupId());
        out.setAssignedTo(lead.getAssignedTo());
        out.setServiceInterest(lead.getServiceInterest());
        out.setStatus(lead.getStatus());
        out.setNote(lead.getNote());
        out.setCreatedAt(lead.getCreatedAt());
        out.setUpdatedAt(lead.getUpdatedAt());

        return out;
    }

    public LeadInteractionOutput toInteractionOutput(LeadInteraction inter) {
        if (inter == null) return null;

        LeadInteractionOutput out = new LeadInteractionOutput();
        out.setId(inter.getId());
        out.setLeadId(inter.getLeadId());
        out.setType(inter.getType());
        out.setNote(inter.getNote());
        out.setInteractionDate(inter.getInteractionDate());
        out.setCreatedBy(inter.getCreatedBy());
        out.setCreatedAt(inter.getCreatedAt());

        return out;
    }
}