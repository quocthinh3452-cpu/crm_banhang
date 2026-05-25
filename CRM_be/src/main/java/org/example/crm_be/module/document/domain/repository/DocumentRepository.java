package org.example.crm_be.module.document.domain.repository;

import org.example.crm_be.module.document.domain.entity.Document;

import java.util.List;
import java.util.Optional;

public interface DocumentRepository {
    Document save(Document document);
    Optional<Document> findById(Long id);
    List<Document> findAll();
    void deleteById(Long id);
}
    