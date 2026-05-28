package org.example.crm_be.module.customer_documents.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "customer_documents")
@Getter
@Setter
public class CustomerDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id")
    private Integer customerId;

    private String name;

    @Column(name = "file_url")
    private String fileUrl;

    private String type;

    @Column(name = "uploaded_by")
    private Integer uploadedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}