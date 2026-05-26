package org.example.crm_be.module.lead.infrastructure.persistence.mapper;

import org.example.crm_be.module.lead.domain.entity.Lead;
import org.example.crm_be.module.lead.domain.entity.LeadInteraction;
import org.example.crm_be.module.lead.infrastructure.persistence.entity.LeadDbEntity;
import org.example.crm_be.module.lead.infrastructure.persistence.entity.LeadInteractionDbEntity;
import org.springframework.stereotype.Component;

@Component
public class LeadPersistenceMapper {

    public Lead toDomain(LeadDbEntity db) {
        if (db == null) return null;
        return Lead.builder()
                .id(db.getId()).name(db.getName()).company(db.getCompany()).phone(db.getPhone())
                .email(db.getEmail()).expectedRevenue(db.getExpectedRevenue()).taxCode(db.getTaxCode())
                .idCard(db.getIdCard()).provinceId(db.getProvinceId()).sourceId(db.getSourceId())
                .salesGroupId(db.getSalesGroupId()).assignedTo(db.getAssignedTo())
                .serviceInterest(db.getServiceInterest()).status(db.getStatus()).note(db.getNote())
                .createdAt(db.getCreatedAt()).updatedAt(db.getUpdatedAt()).build();
    }

    public LeadDbEntity toDbEntity(Lead d) {
        if (d == null) return null;
        return LeadDbEntity.builder()
                .id(d.getId()).name(d.getName()).company(d.getCompany()).phone(d.getPhone())
                .email(d.getEmail()).expectedRevenue(d.getExpectedRevenue()).taxCode(d.getTaxCode())
                .idCard(d.getIdCard()).provinceId(d.getProvinceId()).sourceId(d.getSourceId())
                .salesGroupId(d.getSalesGroupId()).assignedTo(d.getAssignedTo())
                .serviceInterest(d.getServiceInterest()).status(d.getStatus()).note(d.getNote())
                .createdAt(d.getCreatedAt()).updatedAt(d.getUpdatedAt()).build();
    }

    public LeadInteraction toDomainInteraction(LeadInteractionDbEntity db) {
        if (db == null) return null;
        return LeadInteraction.builder()
                .id(db.getId()).leadId(db.getLeadId()).type(db.getType()).note(db.getNote())
                .interactionDate(db.getInteractionDate()).createdBy(db.getCreatedBy())
                .createdAt(db.getCreatedAt()).build();
    }

    public LeadInteractionDbEntity toDbInteraction(LeadInteraction d) {
        if (d == null) return null;
        return LeadInteractionDbEntity.builder()
                .id(d.getId()).leadId(d.getLeadId()).type(d.getType()).note(d.getNote())
                .interactionDate(d.getInteractionDate()).createdBy(d.getCreatedBy())
                .createdAt(d.getCreatedAt()).build();
    }
}
