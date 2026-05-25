package org.example.crm_be.module.document.infrastructure.persistence;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents") // Thay bằng tên bảng thực tế của bạn
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentDbEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(length = 100)
    private String type;

    @Column(length = 20)
    private String version;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "uploaded_by")
    private Integer uploadedBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime    createdAt;
}
