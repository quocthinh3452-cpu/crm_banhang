package org.example.crm_be.module.lead.domain.entity;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadInteraction {
    private Integer id; // Đã sửa
    private Integer leadId; // Đã sửa
    private InteractionType type;
    private String note;
    private LocalDateTime interactionDate;
    private Integer createdBy; // Đã sửa
    private LocalDateTime createdAt;
}