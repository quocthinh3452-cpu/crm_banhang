package org.example.crm_be.module.document.application.interactor;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.document.application.dto.input.DocumentRequest;
import org.example.crm_be.module.document.application.dto.output.DocumentResponse;
import org.example.crm_be.module.document.application.mapper.DocumentMapper;
import org.example.crm_be.module.document.application.usecase.ICreateDocument;
import org.example.crm_be.module.document.domain.entity.Document;
import org.example.crm_be.module.document.domain.repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CreateDocumentImpl implements ICreateDocument {

    private final DocumentRepository documentRepository;
    private final DocumentMapper documentMapper;

    @Override
    @Transactional
    public DocumentResponse execute(DocumentRequest request, String filePath, Integer userId) {
        // 1. Kiểm tra xem có tài liệu nào trùng tên không
        Optional<Document> existingOpt = documentRepository.findByName(request.getName());

        if (existingOpt.isPresent()) {
            Document existing = existingOpt.get();

            // Nếu tài liệu đang bị xóa mềm (isDeleted == 1)
            if (existing.isSoftDeleted()) {
                // Khôi phục lại
                existing.revive();
                
                // Cập nhật lại thông tin mới
                documentMapper.updateDomainFromRequest(request, existing);
                if (filePath != null) {
                    existing.setFilePath(filePath);
                }
                existing.initializeForCreation(userId); // Thiết lập người dùng và thời gian tạo mới

                Document saved = documentRepository.save(existing);
                return documentMapper.toResponse(saved);
            } else {
                // Nếu tài liệu đang hoạt động bình thường, báo lỗi trùng tên
                throw new IllegalArgumentException("Tài liệu mang tên '" + request.getName() + "' đã tồn tại trong hệ thống.");
            }
        }

        // 2. Nếu không trùng tên, tạo mới tài liệu
        Document document = documentMapper.toDomain(request);
        document.setFilePath(filePath != null ? filePath : "");
        document.initializeForCreation(userId);

        Document saved = documentRepository.save(document);
        return documentMapper.toResponse(saved);
    }
}
