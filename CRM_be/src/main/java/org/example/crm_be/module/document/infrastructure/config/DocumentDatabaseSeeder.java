package org.example.crm_be.module.document.infrastructure.config;

import org.example.crm_be.module.document.domain.entity.Document;
import org.example.crm_be.module.document.domain.repository.DocumentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

//@Configuration
public class DocumentDatabaseSeeder {
    @Bean
    public CommandLineRunner seedDocuments(DocumentRepository documentRepository) {
        return args -> {
            // Chỉ insert nếu trong database chưa có dữ liệu tài liệu (tránh chạy lại nhiều lần)
            if (documentRepository.findAll().isEmpty()) {
                System.out.println("Đang tạo 10.000 tài liệu mẫu...");
                List<Document> dummyDocuments = new ArrayList<>();
                Random random = new Random();
                String[] types = {"Hợp đồng", "Biểu mẫu", "Báo cáo", "Quy chế", "Tài liệu kỹ thuật"};

                for (int i = 1; i <= 10000; i++) {
                    Document doc = new Document();
                    doc.setName("Tài liệu tự động " + i);
                    doc.setFilePath("/uploads/tailieu_sample_" + i + ".pdf");
                    doc.setType(types[random.nextInt(types.length)]);
                    doc.setVersion(String.format("v%d.0", random.nextInt(3) + 1));
                    doc.setReleaseDate(LocalDate.now().minusDays(random.nextInt(365)));
                    doc.setExpiryDate(LocalDate.now().plusDays(random.nextInt(730) + 30));
                    doc.setUploadedBy(1);
                    doc.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(30)));
                    doc.setIsDeleted(random.nextInt(100) > 80 ? 1 : 0); // 20% tỉ lệ đã xóa mềm

                    dummyDocuments.add(doc);

                    // Lưu theo lô (Batch) mỗi 1000 records để không tràn RAM
                    if (i % 1000 == 0) {
                        for (Document document : dummyDocuments) {
                            documentRepository.save(document);
                        }
                        dummyDocuments.clear();
                    }
                }
                System.out.println("Tạo dữ liệu tài liệu thành công!");
            }
        };
    }
}
