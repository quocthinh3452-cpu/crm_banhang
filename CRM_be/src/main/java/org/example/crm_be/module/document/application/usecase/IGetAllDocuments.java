package org.example.crm_be.module.document.application.usecase;

import org.example.crm_be.module.document.application.dto.output.DocumentResponse;
import java.util.List;

public interface IGetAllDocuments {
    List<DocumentResponse> execute();
}
