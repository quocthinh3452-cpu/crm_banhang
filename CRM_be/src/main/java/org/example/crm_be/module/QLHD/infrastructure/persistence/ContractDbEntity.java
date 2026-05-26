package org.example.crm_be.module.QLHD.infrastructure.persistence;

import jakarta.persistence.*;
import lombok.*;
import org.example.crm_be.common.persistence.CustomerDbEntity;
import org.example.crm_be.common.persistence.UserDbEntity;
import org.example.crm_be.module.QLBG.infrastructure.persistence.QuoteDbEntity;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "contracts")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor
public class ContractDbEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "contract_number", unique = true, length = 50, nullable = false)
    private String contractNumber;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private CustomerDbEntity customer;

    @ManyToOne
    @JoinColumn(name = "quote_id")
    private QuoteDbEntity quote;

    @ManyToOne
    @JoinColumn(name = "template_id")
    private ContractTemplateDbEntity template;

    @Column(name = "sign_date")
    private LocalDate signDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "`value`", precision = 15, scale = 2, nullable = false)
    private BigDecimal value;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private UserDbEntity manager;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private org.example.crm_be.module.QLHD.domain.entity.ContractStatus status;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
