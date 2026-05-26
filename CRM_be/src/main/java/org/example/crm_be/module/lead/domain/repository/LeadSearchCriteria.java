package org.example.crm_be.module.lead.domain.repository;

import org.example.crm_be.module.lead.domain.entity.LeadStatus;
import lombok.Data;

@Data
public class LeadSearchCriteria {
    private String keyword;
    private Integer provinceId;
    private Integer salesGroupId;
    private Integer sourceId;
    private String phone;
    private LeadStatus status;
}