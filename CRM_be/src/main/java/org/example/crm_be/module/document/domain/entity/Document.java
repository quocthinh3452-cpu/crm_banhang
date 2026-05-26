package org.example.crm_be.module.document.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Document {
    private Long id;
    private String name;
    private String filePath;
    private String type;
    private String version;
    private LocalDate releaseDate;
    private LocalDate expiryDate;
    private Integer uploadedBy;
    private LocalDateTime createdAt;
    private Integer isDeleted;

    // Ví dụ hàm nghiệp vụ (DDD)
    public void initializeForCreation(Integer userId) {
        this.uploadedBy = userId;
        this.createdAt = LocalDateTime.now();
        this.isDeleted = 0;
    }

    public void markAsDeleted() {
        this.isDeleted = 1;
    }

    public void revive() {
        this.isDeleted = 0;
    }

    public boolean isSoftDeleted() {
        return this.isDeleted != null && this.isDeleted == 1;
    }
}
