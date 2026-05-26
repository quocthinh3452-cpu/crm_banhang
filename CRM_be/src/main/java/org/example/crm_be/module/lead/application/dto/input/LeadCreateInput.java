package org.example.crm_be.module.lead.application.dto.input;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class LeadCreateInput {
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
    private String note;
}