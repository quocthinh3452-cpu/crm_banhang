package org.example.crm_be.module.product.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    private Long id;
    private String productCode;
    private Long typeId;
    private String name;
    private BigDecimal price;
    private String imageUrl;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer isDeleted;
    private String typeName;
    // --- NHÓM LOGIC NGHIỆP VỤ ---

    /**
     * Tự kiểm tra tính hợp lệ của đối tượng (Self-Validation)
     * Ngăn chặn việc dữ liệu sai trái đi sâu vào hệ thống.
     */
    public void validate() {
        if (this.productCode == null || this.productCode.isBlank()) {
            throw new IllegalArgumentException("Mã sản phẩm không được để trống.");
        }
        if (this.name == null || this.name.isBlank()) {
            throw new IllegalArgumentException("Tên sản phẩm không được để trống.");
        }
        if (this.price == null || this.price.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Giá sản phẩm không được là số âm.");
        }
        if (this.typeId == null || this.typeId <= 0) {
            throw new IllegalArgumentException("Loại sản phẩm chưa được chọn.");
        }
    }

    /**
     * Logic cập nhật giá có kiểm soát
     */
    public void changePrice(BigDecimal newPrice) {
        if (newPrice == null || newPrice.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Giá mới không hợp lệ.");
        }
        this.price = newPrice;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Logic Xóa mềm (Soft Delete) - Bảo vệ dữ liệu
     */
    public void markAsDeleted() {
        this.isDeleted = 0;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Kiểm tra sản phẩm còn hoạt động hay không
     */
    public boolean isActive() {
        return this.isDeleted != null && this.isDeleted == 0;
    }
    /**
     * Logic khởi tạo trạng thái mặc định khi tạo mới một sản phẩm
     */
    public void initializeForCreation() {
        this.isDeleted = 0;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
