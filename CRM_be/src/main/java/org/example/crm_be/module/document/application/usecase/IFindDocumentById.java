package org.example.crm_be.module.document.application.usecase;

import org.example.crm_be.module.document.application.dto.output.DocumentResponse;
import java.util.Optional;

public interface IFindDocumentById {
    Optional<DocumentResponse> execute(Long id);
}
