package org.example.crm_be.module.lead.application.dto.output;

import org.example.crm_be.module.lead.domain.entity.InteractionType;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LeadInteractionOutput {
    private Integer id;
    private Integer leadId;
    private InteractionType type;
    private String note;
    private LocalDateTime interactionDate;
    private Integer createdBy;
    private LocalDateTime createdAt;
}