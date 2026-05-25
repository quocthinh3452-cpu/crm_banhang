package org.example.crm_be.module.product.application.usecase;

import org.springframework.web.multipart.MultipartFile;

public interface IUploadService {
    String saveFile(MultipartFile file);
}
