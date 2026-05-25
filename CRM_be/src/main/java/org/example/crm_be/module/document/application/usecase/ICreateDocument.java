package org.example.crm_be.module.document.application.usecase;

import org.example.crm_be.module.document.application.dto.input.DocumentRequest;
import org.example.crm_be.module.document.application.dto.output.DocumentResponse;

public interface ICreateDocument {
    DocumentResponse execute(DocumentRequest request, String filePath, Integer userId);
}
