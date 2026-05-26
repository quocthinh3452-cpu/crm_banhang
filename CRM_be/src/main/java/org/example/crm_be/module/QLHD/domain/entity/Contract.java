package org.example.crm_be.module.QLHD.domain.entity;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Contract {
    private int id;
    private String contractNumber;
    private int customerId;
    private String customerName;
    private Integer quoteId;
    private Integer templateId;
    private LocalDate signDate;
    private LocalDate expiryDate;
    private BigDecimal value;
    private Integer managerId;
    private String managerName;
    private String status;
    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
