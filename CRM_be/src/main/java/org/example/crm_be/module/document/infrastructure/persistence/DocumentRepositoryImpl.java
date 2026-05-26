package org.example.crm_be.module.document.infrastructure.persistence;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.document.domain.entity.Document;
import org.example.crm_be.module.document.domain.repository.DocumentRepository;
import org.example.crm_be.module.document.application.mapper.DocumentMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class DocumentRepositoryImpl implements DocumentRepository {

    private final DocumentJpaRepository jpaRepository;
    private final DocumentMapper mapper;

    @Override
    public Document save(Document document) {
        DocumentDbEntity dbEntity = mapper.toDb(document);
        DocumentDbEntity saved = jpaRepository.save(dbEntity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Document> findById(Long id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<Document> findByName(String name) {
        return jpaRepository.findByName(name).map(mapper::toDomain);
    }

    @Override
    public List<Document> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
}
