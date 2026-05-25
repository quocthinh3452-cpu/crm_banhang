package org.example.crm_be.module.document.presentation.controller;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.document.application.dto.input.DocumentRequest;
import org.example.crm_be.module.document.application.dto.output.DocumentResponse;
import org.example.crm_be.module.document.application.usecase.*;
import org.example.crm_be.module.product.application.usecase.IUploadService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/documents")
public class DocumentRestController {

    private final IGetAllDocuments getAllDocuments;
    private final IFindDocumentById findDocumentById;
    private final ICreateDocument createDocument;
    private final IUpdateDocument updateDocument;
    private final IDeleteDocument deleteDocument;
    private final IUploadService uploadService;

    @GetMapping
    public ResponseEntity<List<DocumentResponse>> getDocuments() {
        return ResponseEntity.ok(getAllDocuments.execute());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponse> getDocumentById(@PathVariable Long id) {
        return findDocumentById.execute(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createDocument(
            @RequestPart("data") DocumentRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            String filePath = null;
            if (file != null && !file.isEmpty()) {
                filePath = uploadService.saveFile(file);
            }
            // Mặc định fake uploadedBy = 1
            DocumentResponse response = createDocument.execute(request, filePath, 1);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDocument(
            @PathVariable Long id,
            @RequestPart("data") DocumentRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        try {
            String filePath = null;
            if (file != null && !file.isEmpty()) {
                filePath = uploadService.saveFile(file);
            }
            // Mặc định fake uploadedBy = 1
            DocumentResponse response = updateDocument.execute(id, request, filePath, 1);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        try {
            deleteDocument.execute(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
