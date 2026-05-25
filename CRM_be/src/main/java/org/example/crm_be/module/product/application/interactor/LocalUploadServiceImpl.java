package org.example.crm_be.module.product.application.interactor;

import org.example.crm_be.module.product.application.usecase.IUploadService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalUploadServiceImpl implements IUploadService {

    // Thư mục gốc để lưu ảnh trên máy của bạn
    private final String UPLOAD_DIR = "uploads/products/";

    public LocalUploadServiceImpl() {
        // Khởi tạo: Tự động tạo thư mục nếu nó chưa tồn tại
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Không thể tạo thư mục chứa ảnh", e);
        }
    }

    @Override
    public String saveFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        try {
            // 1. Lấy đuôi file gốc (ví dụ: .jpg, .png)
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            // 2. Tạo tên file mới ngẫu nhiên (chống trùng lặp hoặc lỗi ký tự tiếng Việt)
            // Ví dụ: 123e4567-e89b-12d3.jpg
            String uniqueFileName = UUID.randomUUID().toString() + extension;

            // 3. Đường dẫn đích đến
            Path destinationFilePath = Paths.get(UPLOAD_DIR + uniqueFileName);

            // 4. Lưu file vật lý vào thư mục
            Files.copy(file.getInputStream(), destinationFilePath, StandardCopyOption.REPLACE_EXISTING);

            // 5. Trả về tên file (hoặc 1 URL tương đối) để lưu vào Database
            // Ở đây tôi trả về đường dẫn URL giả định để frontend có thể gọi được ảnh
            return "/uploads/products/" + uniqueFileName;

        } catch (IOException e) {
            throw new RuntimeException("Lỗi hệ thống khi lưu file: " + e.getMessage());
        }
    }
}