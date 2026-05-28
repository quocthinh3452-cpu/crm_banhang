package org.example.crm_be.module.customer_interactions.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "customer_interactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerInteraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id")
    private Integer customerId;

    private String type;

    private String note;

    @Column(name = "interaction_date")
    private LocalDateTime interactionDate;

    @Column(name = "created_by")
    private Integer createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}