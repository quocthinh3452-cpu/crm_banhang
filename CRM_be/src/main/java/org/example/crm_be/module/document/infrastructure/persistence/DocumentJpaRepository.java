package org.example.crm_be.module.document.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentJpaRepository extends JpaRepository<DocumentDbEntity, Long> {
}
