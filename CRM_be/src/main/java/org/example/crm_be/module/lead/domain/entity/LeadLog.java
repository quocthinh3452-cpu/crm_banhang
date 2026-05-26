package org.example.crm_be.module.lead.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lead_interactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "lead_id")
    private Integer leadId;

    @Column(name = "type") // Trong DB là cột 'type', ta map vào biến 'action'
    private String action;

    @Column(name = "note")
    private String note;

    @Column(name = "interaction_date")
    private LocalDateTime interactionDate;

    @Column(name = "created_by")
    private Integer createdBy;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    // Tự động gán thời gian hiện tại trước khi lưu nếu chưa có
    @PrePersist
    protected void onCreate() {
        if (this.interactionDate == null) {
            this.interactionDate = LocalDateTime.now();
        }
    }
}