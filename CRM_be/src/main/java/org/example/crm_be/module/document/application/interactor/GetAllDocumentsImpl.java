package org.example.crm_be.module.document.application.interactor;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.document.application.dto.output.DocumentResponse;
import org.example.crm_be.module.document.application.mapper.DocumentMapper;
import org.example.crm_be.module.document.application.usecase.IGetAllDocuments;
import org.example.crm_be.module.document.domain.repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetAllDocumentsImpl implements IGetAllDocuments {

    private final DocumentRepository documentRepository;
    private final DocumentMapper documentMapper;

    @Override
    public List<DocumentResponse> execute() {
        return documentRepository.findAll().stream()
                .filter(doc -> !doc.isSoftDeleted()) // Chỉ lấy các tài liệu chưa bị xóa mềm
                .map(documentMapper::toResponse)
                .collect(Collectors.toList());
    }
}
