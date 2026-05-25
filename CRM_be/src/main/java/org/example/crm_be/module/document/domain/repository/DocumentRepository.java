package org.example.crm_be.module.document.domain.repository;

import org.example.crm_be.module.document.domain.entity.Document;

import java.util.List;
import java.util.Optional;

public interface DocumentRepository {
    Document save(Document document);
    Optional<Document> findById(Long id);
    Optional<Document> findByName(String name);
    List<Document> findAll();
    void deleteById(Long id);
}
    