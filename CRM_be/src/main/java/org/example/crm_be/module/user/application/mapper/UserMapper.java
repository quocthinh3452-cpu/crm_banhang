package org.example.crm_be.module.user.application.mapper;

import org.example.crm_be.module.user.application.dto.input.UserRequest;
import org.example.crm_be.module.user.application.dto.output.UserResponse;
import org.example.crm_be.module.user.domain.entity.User;
import org.example.crm_be.module.user.infrastructure.persistence.UserDbEntity;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toDomain(UserRequest request) {
        if (request == null) return null;
        return User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(request.getRole())
                .permissions(request.getPermissions())
                .isActive(request.getIsActive() != null ? request.getIsActive() : 1)
                .build();
    }

    public UserResponse toResponse(User domain) {
        if (domain == null) return null;
        return UserResponse.builder()
                .id(domain.getId())
                .name(domain.getName())
                .email(domain.getEmail())
                .role(domain.getRole())
                .permissions(domain.getPermissions())
                .isActive(domain.getIsActive())
                .createdAt(domain.getCreatedAt())
                .build();
    }

    public UserDbEntity toDb(User domain) {
        if (domain == null) return null;
        return UserDbEntity.builder()
                .id(domain.getId())
                .name(domain.getName())
                .email(domain.getEmail())
                .password(domain.getPassword())
                .role(domain.getRole())
                .permissions(domain.getPermissions())
                .isActive(domain.getIsActive() != null ? domain.getIsActive() : 1)
                .createdAt(domain.getCreatedAt())
                .isDeleted(domain.getIsDeleted() != null ? domain.getIsDeleted() : 0)
                .build();
    }

    public User toDomain(UserDbEntity db) {
        if (db == null) return null;
        return User.builder()
                .id(db.getId())
                .name(db.getName())
                .email(db.getEmail())
                .password(db.getPassword())
                .role(db.getRole())
                .permissions(db.getPermissions())
                .isActive(db.getIsActive())
                .createdAt(db.getCreatedAt())
                .isDeleted(db.getIsDeleted())
                .build();
    }

    public void updateDomainFromRequest(UserRequest request, User domain) {
        if (request == null || domain == null) return;
        domain.setName(request.getName());
        domain.setEmail(request.getEmail());
        domain.setRole(request.getRole());
        domain.setPermissions(request.getPermissions());
        if (request.getIsActive() != null) {
            domain.setIsActive(request.getIsActive());
        }
        // Lưu ý: mật khẩu băm sẽ được xử lý riêng ở UseCase Interactor
    }
}
