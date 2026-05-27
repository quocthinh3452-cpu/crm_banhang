package org.example.crm_be.module.customers.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "customers")

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String customerCode;

    private String name;

    private String type;
    // B2B | B2C

    private String tier;
    // GOLD | SILVER | DIAMOND

    private String phone;

    private String email;

    private String taxCode;

    private String address;

    private String status;
    // ACTIVE | INACTIVE | BLACKLIST

    private String note;

    private Long budget;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}