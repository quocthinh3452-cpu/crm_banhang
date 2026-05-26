package org.example.crm_be.module.QLBG.infrastructure.persistence;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.example.crm_be.common.persistence.CustomerDbEntity;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quotes") // Khớp tên bảng thật
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor
public class QuoteDbEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "quote_number", unique = true, length = 50, nullable = false)
    private String quoteNumber;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false) // Đổi từ lead_id thành customer_id
    private CustomerDbEntity customer;

    @Column(name = "deal_id") // Bổ sung trường deal_id
    private Integer dealId;

    @Column(name = "template_id") // Bổ sung trường template_id
    private Integer templateId;

    @Column(name = "date", nullable = false) // Khớp tên cột date
    private LocalDate date;

    @Column(name = "validity_date") // Khớp tên cột validity_date
    private LocalDate validityDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20) // Gộp stage và approval_status
    private org.example.crm_be.module.QLBG.domain.entity.QuoteStatus status;

    @Column(name = "subtotal", precision = 15, scale = 2, nullable = false) // Cột subtotal
    private BigDecimal subtotal;

    @Column(name = "discount", precision = 15, scale = 2, nullable = false) // Cột discount
    private BigDecimal discount;

    @Column(name = "tax", precision = 15, scale = 2, nullable = false) // Cột tax
    private BigDecimal tax;

    @Column(name = "total", precision = 15, scale = 2, nullable = false) // Cột total
    private BigDecimal total;

    @Column(name = "note", columnDefinition = "TEXT") // Bổ sung note
    private String note;

    @Column(name = "created_by") // Bổ sung created_by
    private Integer createdBy;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "quote", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuoteDetailDbEntity> details = new ArrayList<>();

    public void addDetail(QuoteDetailDbEntity detail) {
        details.add(detail);
        detail.setQuote(this);
    }
}
