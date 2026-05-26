package org.example.crm_be.module.lead.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.crm_be.module.lead.domain.entity.InteractionType;
import java.time.LocalDateTime;

@Entity
@Table(name = "lead_interactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadInteractionDbEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // Đã sửa thành Integer

    @Column(name = "lead_id", nullable = false)
    private Integer leadId; // Đã sửa thành Integer

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InteractionType type;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "interaction_date", nullable = false)
    private LocalDateTime interactionDate;

    @Column(name = "created_by")
    private Integer createdBy; // Đã sửa thành Integer

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}