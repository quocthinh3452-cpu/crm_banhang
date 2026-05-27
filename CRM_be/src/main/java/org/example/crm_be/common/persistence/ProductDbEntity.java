package org.example.crm_be.common.persistence;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity(name = "CommonProductDbEntity")
@Table(name = "products")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProductDbEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String code;

    @Column(length = 255)
    private String name;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(precision = 38, scale = 2)
    private BigDecimal price;

    @Column(length = 255)
    private String image;

    @Column(length = 255)
    private String description;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
