package org.example.crm_be.module.user.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserJpaRepository extends JpaRepository<UserDbEntity, Long> {
    Optional<UserDbEntity> findByEmail(String email);
    Optional<UserDbEntity> findByEmailAndIsDeleted(String email, Integer isDeleted);
}
