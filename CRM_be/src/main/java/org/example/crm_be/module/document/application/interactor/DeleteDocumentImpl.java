package org.example.crm_be.module.document.application.interactor;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.document.application.usecase.IDeleteDocument;
import org.example.crm_be.module.document.domain.entity.Document;
import org.example.crm_be.module.document.domain.repository.DocumentRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteDocumentImpl implements IDeleteDocument {

    private final DocumentRepository documentRepository;

    @Override
    @Transactional
    public void execute(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài liệu với ID: " + id));

        // Thực hiện xóa mềm
        document.markAsDeleted();
        documentRepository.save(document);
    }
}
