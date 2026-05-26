package org.example.crm_be.module.document.application.mapper;

import org.example.crm_be.module.document.application.dto.input.DocumentRequest;
import org.example.crm_be.module.document.application.dto.output.DocumentResponse;
import org.example.crm_be.module.document.domain.entity.Document;
import org.example.crm_be.module.document.infrastructure.persistence.DocumentDbEntity;
import org.springframework.stereotype.Component;

@Component
public class DocumentMapper {

    public Document toDomain(DocumentRequest request) {
        if (request == null) return null;
        return Document.builder()
                .name(request.getName())
                .type(request.getType())
                .version(request.getVersion())
                .releaseDate(request.getReleaseDate())
                .expiryDate(request.getExpiryDate())
                .isDeleted(0)
                .build();
    }

    public DocumentResponse toResponse(Document domain) {
        if (domain == null) return null;
        return DocumentResponse.builder()
                .id(domain.getId())
                .name(domain.getName())
                .filePath(domain.getFilePath())
                .type(domain.getType())
                .version(domain.getVersion())
                .releaseDate(domain.getReleaseDate())
                .expiryDate(domain.getExpiryDate())
                .uploadedBy(domain.getUploadedBy())
                .createdAt(domain.getCreatedAt())
                .build();
    }

    public DocumentDbEntity toDb(Document domain) {
        if (domain == null) return null;
        return DocumentDbEntity.builder()
                .id(domain.getId())
                .name(domain.getName())
                .filePath(domain.getFilePath())
                .type(domain.getType())
                .version(domain.getVersion())
                .releaseDate(domain.getReleaseDate())
                .expiryDate(domain.getExpiryDate())
                .uploadedBy(domain.getUploadedBy())
                .createdAt(domain.getCreatedAt())
                .isDeleted(domain.getIsDeleted() != null ? domain.getIsDeleted() : 0)
                .build();
    }

    public Document toDomain(DocumentDbEntity db) {
        if (db == null) return null;
        return Document.builder()
                .id(db.getId())
                .name(db.getName())
                .filePath(db.getFilePath())
                .type(db.getType())
                .version(db.getVersion())
                .releaseDate(db.getReleaseDate())
                .expiryDate(db.getExpiryDate())
                .uploadedBy(db.getUploadedBy())
                .createdAt(db.getCreatedAt())
                .isDeleted(db.getIsDeleted())
                .build();
    }

    public void updateDomainFromRequest(DocumentRequest request, Document domain) {
        if (request == null || domain == null) return;
        domain.setName(request.getName());
        domain.setType(request.getType());
        domain.setVersion(request.getVersion());
        domain.setReleaseDate(request.getReleaseDate());
        domain.setExpiryDate(request.getExpiryDate());
    }
}
