package org.example.crm_be.module.document.application.dto.output;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentResponse {

    private Long id;

    private String name;

    private String filePath; // Backend trả về đường dẫn để Frontend làm nút "Tải xuống"

    private String type;

    private String version;

    private LocalDate releaseDate;

    private LocalDate expiryDate;

    private Integer uploadedBy; // ID của người đã upload (lúc nãy chúng ta đang fake là 1L)

    private LocalDateTime createdAt; // Thời gian tạo
}
