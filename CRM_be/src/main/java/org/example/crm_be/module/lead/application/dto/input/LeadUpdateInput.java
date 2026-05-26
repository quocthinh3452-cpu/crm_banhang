package org.example.crm_be.module.lead.application.dto.input;

import org.example.crm_be.module.lead.domain.entity.LeadStatus;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class LeadUpdateInput {
    private String name;
    private String company;
    private String phone;
    private String email;
    private BigDecimal expectedRevenue;
    private String taxCode;
    private String idCard;
    private Integer provinceId;
    private Integer sourceId;
    private Integer salesGroupId;
    private Integer assignedTo;
    private String serviceInterest;
    private LeadStatus status;
    private String note;
}
