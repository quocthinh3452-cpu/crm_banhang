package org.example.crm_be.module.lead.application.dto.input;

import org.example.crm_be.module.lead.domain.entity.InteractionType;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LeadInteractionInput {
    private InteractionType type;
    private String note;
    private LocalDateTime interactionDate;
    private Integer createdBy;
}
