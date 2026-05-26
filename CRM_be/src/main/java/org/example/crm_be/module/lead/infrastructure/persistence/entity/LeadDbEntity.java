package org.example.crm_be.module.lead.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.crm_be.module.lead.domain.entity.LeadStatus;
import org.example.crm_be.module.lead.domain.entity.LeadStatusConverter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeadDbEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 200)
    private String company;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(name = "expected_revenue", precision = 15, scale = 2)
    private BigDecimal expectedRevenue;

    @Column(name = "tax_code", length = 20)
    private String taxCode;

    @Column(name = "id_card", length = 20)
    private String idCard;

    @Column(name = "province_id", columnDefinition = "TINYINT UNSIGNED")
    private Integer provinceId;

    @Column(name = "source_id", columnDefinition = "TINYINT UNSIGNED")
    private Integer sourceId;

    // Đã sửa từ Long thành Integer để đồng bộ với MySQL (INT)
    @Column(name = "sales_group_id", columnDefinition = "INT UNSIGNED")
    private Integer salesGroupId;

    @Column(name = "assigned_to", columnDefinition = "INT UNSIGNED")
    private Integer assignedTo;

    @Column(name = "service_interest", columnDefinition = "TEXT")
    private String serviceInterest;

    @Convert(converter = LeadStatusConverter.class)
    @Column(nullable = false)
    private LeadStatus status;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}