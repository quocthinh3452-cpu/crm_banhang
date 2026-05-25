package org.example.crm_be.module.document.application.dto.input;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentRequest {

    @NotBlank(message = "Tên tài liệu không được để trống")
    @Size(max = 200, message = "Tên tài liệu không được vượt quá 200 ký tự")
    private String name;

    @Size(max = 100, message = "Loại tài liệu không được vượt quá 100 ký tự")
    private String type;

    @Size(max = 20, message = "Phiên bản không được vượt quá 20 ký tự")
    private String version;

    // Ngày phát hành có thể truyền hoặc không
    private LocalDate releaseDate;

    // Ngày hết hạn có thể truyền hoặc không
    private LocalDate expiryDate;

    /*
     * LÝ DO KHÔNG CÓ CÁC TRƯỜNG SAU TRONG FILE NÀY:
     * * 1. filePath: Đường dẫn file sẽ được hệ thống (Backend) tự động sinh ra
     * sau khi upload thành công MultipartFile, người dùng không được tự nhập URL.
     * * 2. uploadedBy: Backend sẽ tự động trích xuất ID người dùng đang đăng nhập
     * từ Security Context (Token), chống việc user này fake ID của user khác.
     * * 3. createdAt: Thời gian tạo luôn được gán tự động bằng LocalDateTime.now()
     * bên trong phương thức initializeForCreation() của Entity.
     */
}
