package org.example.crm_be.module.product.presentation.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.example.crm_be.module.product.application.dto.input.ProductRequest;
import org.example.crm_be.module.product.application.dto.output.ProductResponse;
import org.example.crm_be.module.product.application.mapper.ProductMapper;
import org.example.crm_be.module.product.application.usecase.*;
import org.example.crm_be.module.product.domain.entity.PageResult;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@CrossOrigin(origins = "*") // Bật CORS để Next.js (port 3000) có thể gọi API
@RestController
@AllArgsConstructor
@RequestMapping("/api/products")
public class ProductRestController {

    private final IGetAllProducts getAllProducts;
    private final IDeleteProduct deleteProduct;
    private final IFindProductById findProductById;
//    private final ICheckProductCode checkProductCode;
    private final ICreateProduct createProduct;
    private final IRestoreProduct restoreProduct; // Thêm Use Case phục hồi
    private final ProductMapper productMapper;
    private final IUpdateProduct updateProduct;


    // 1. LẤY DANH SÁCH (Hỗ trợ Phân trang, Lọc, Tìm kiếm)
    @GetMapping
    public ResponseEntity<PageResult<ProductResponse>> getProductsData(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size, // Tăng mặc định lên 10 cho phù hợp API
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long typeId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "createdAt") String sortField,
            @RequestParam(defaultValue = "desc") String sortDir) {

        LocalDateTime startDT = (startDate != null) ? startDate.atStartOfDay() : null;
        LocalDateTime endDT = (endDate != null) ? endDate.atTime(LocalTime.MAX) : null;

        PageResult<ProductResponse> data = getAllProducts.execute(
                page, size, keyword, typeId, minPrice, maxPrice, startDT, endDT, sortField, sortDir
        );

        return ResponseEntity.ok(data); // HTTP 200 OK
    }

    // 2. LẤY CHI TIẾT SẢN PHẨM
//    @GetMapping("/{id}")
//    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
//        // Đã sửa: Map Domain Entity sang DTO (ProductResponse) để tránh rò rỉ dữ liệu lõi
//        return findProductById.execute(id)
//                .map(productMapper::toResponse)
//                .map(ResponseEntity::ok) // HTTP 200 OK
//                .orElse(ResponseEntity.notFound().build()); // HTTP 404 Not Found
//    }

    // 3. KIỂM TRA MÃ SẢN PHẨM
//    @GetMapping("/check-code")
//    public ResponseEntity<Boolean> checkCode(@RequestParam String code) {
//        boolean exists = checkProductCode.execute(code);
//        return ResponseEntity.ok(exists); // HTTP 200 OK
//    }

    // 4. THÊM MỚI SẢN PHẨM
    @PostMapping
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest request) {

            // Gọi Use Case thêm mới

            ProductResponse newProduct = createProduct.execute(request, request.getImageUrl());

        // Trả về HTTP 201 Created cho nghiệp vụ tạo mới thành công
        return new ResponseEntity<>(newProduct, HttpStatus.CREATED);
    }

    // 5. CẬP NHẬT SẢN PHẨM
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(@PathVariable Long id,
                                                  @Valid @RequestBody ProductRequest request) {
        // Gọi Use Case cập nhật
        updateProduct.execute(id, request, request.getImageUrl());

        // Lấy lại dữ liệu sau khi cập nhật để trả về cho Frontend hiển thị ngay lập tức
        return findProductById.execute(id)
                .map(productMapper::toResponse)
                .map(ResponseEntity::ok) // HTTP 200 OK
                .orElse(ResponseEntity.notFound().build());
    }

    // 6. XÓA SẢN PHẨM (Soft Delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        deleteProduct.execute(id);

        // Tín hiệu chuẩn RESTful: Trả về HTTP 204 No Content báo hiệu xóa thành công không cần nội dung trả về
        return ResponseEntity.noContent().build();
    }

}
