package org.example.crm_be.module.document.application.interactor;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.document.application.dto.output.DocumentResponse;
import org.example.crm_be.module.document.application.mapper.DocumentMapper;
import org.example.crm_be.module.document.application.usecase.IFindDocumentById;
import org.example.crm_be.module.document.domain.repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FindDocumentByIdImpl implements IFindDocumentById {

    private final DocumentRepository documentRepository;
    private final DocumentMapper documentMapper;

    @Override
    public Optional<DocumentResponse> execute(Long id) {
        return documentRepository.findById(id)
                .filter(doc -> !doc.isSoftDeleted())
                .map(documentMapper::toResponse);
    }
}
