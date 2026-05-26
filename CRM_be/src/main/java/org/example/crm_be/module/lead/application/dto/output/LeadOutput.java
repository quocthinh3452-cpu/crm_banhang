package org.example.crm_be.module.lead.application.dto.output;

import org.example.crm_be.module.lead.domain.entity.LeadStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class LeadOutput {
    private Integer id;
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
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}