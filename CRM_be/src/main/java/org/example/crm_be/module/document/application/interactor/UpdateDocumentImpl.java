package org.example.crm_be.module.document.application.interactor;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.document.application.dto.input.DocumentRequest;
import org.example.crm_be.module.document.application.dto.output.DocumentResponse;
import org.example.crm_be.module.document.application.mapper.DocumentMapper;
import org.example.crm_be.module.document.application.usecase.IUpdateDocument;
import org.example.crm_be.module.document.domain.entity.Document;
import org.example.crm_be.module.document.domain.repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateDocumentImpl implements IUpdateDocument {

    private final DocumentRepository documentRepository;
    private final DocumentMapper documentMapper;

    @Override
    @Transactional
    public DocumentResponse execute(Long id, DocumentRequest request, String filePath, Integer userId) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài liệu với ID: " + id));

        if (document.isSoftDeleted()) {
            throw new IllegalArgumentException("Tài liệu này đã bị xóa.");
        }

        // Kiểm tra trùng tên với tài liệu khác
        Optional<Document> existingOpt = documentRepository.findByName(request.getName());
        if (existingOpt.isPresent() && !existingOpt.get().getId().equals(id)) {
            Document existing = existingOpt.get();
            if (!existing.isSoftDeleted()) {
                throw new IllegalArgumentException("Tên tài liệu '" + request.getName() + "' đã được sử dụng bởi tài liệu khác.");
            }
        }

        documentMapper.updateDomainFromRequest(request, document);
        if (filePath != null) {
            document.setFilePath(filePath);
        }
        document.setUploadedBy(userId);

        Document saved = documentRepository.save(document);
        return documentMapper.toResponse(saved);
    }
}
