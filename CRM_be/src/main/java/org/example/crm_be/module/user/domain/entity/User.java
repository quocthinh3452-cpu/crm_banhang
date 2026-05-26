package org.example.crm_be.module.user.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long id;
    private String name;
    private String email;
    private String password;
    private String role;
    private String permissions; // Dạng chuỗi phân tách bằng dấu phẩy, VD: "PRODUCTS_VIEW,PRODUCTS_MANAGE"
    private Integer isActive;
    private LocalDateTime createdAt;
    private Integer isDeleted;

    public void initializeForCreation() {
        this.createdAt = LocalDateTime.now();
        this.isActive = 1;
        this.isDeleted = 0;
    }

    public void markAsDeleted() {
        this.isDeleted = 1;
    }

    public boolean isSoftDeleted() {
        return this.isDeleted != null && this.isDeleted == 1;
    }

    public boolean isUserActive() {
        return this.isActive != null && this.isActive == 1;
    }
}
