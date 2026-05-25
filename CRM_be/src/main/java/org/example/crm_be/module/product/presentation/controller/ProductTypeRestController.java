package org.example.crm_be.module.product.presentation.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.example.crm_be.module.product.application.dto.input.ProductTypeReqest;
import org.example.crm_be.module.product.application.dto.output.ProductTypeResponse;
import org.example.crm_be.module.product.application.usecase.ICreateProductType;
import org.example.crm_be.module.product.application.usecase.IDeleteProductType;
import org.example.crm_be.module.product.application.usecase.IGetAllProductTypes;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*") // Cho phép Frontend (Next.js) gọi API
@RestController
@AllArgsConstructor
@RequestMapping("/api/product-types")
public class ProductTypeRestController {

    private final IGetAllProductTypes getAllProductTypes;
    private final ICreateProductType createProductType;
    private final IDeleteProductType deleteProductType;


    // 1. Lấy danh sách tất cả danh mục
    @GetMapping
    public ResponseEntity<List<ProductTypeResponse>> listTypes() {
        List<ProductTypeResponse> types = getAllProductTypes.execute();
        return ResponseEntity.ok(types); // Trả về 200 OK kèm JSON list
    }

    // 2. Thêm mới danh mục
    @PostMapping
    public ResponseEntity<?> addProductType(@Valid @RequestBody ProductTypeReqest request) {
        try {
            createProductType.execute(request);
            // Trả về 201 Created khi thành công
            return new ResponseEntity<>("Thêm loại sản phẩm thành công!", HttpStatus.CREATED);

        } catch (IllegalArgumentException e) {
            // Trả về 400 Bad Request nếu logic nghiệp vụ không hợp lệ (ví dụ trùng tên)
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 3. Xóa danh mục
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProductType(@PathVariable("id") Long id) {
        try {
            deleteProductType.execute(id);
            return ResponseEntity.noContent().build(); // 204 No Content nếu xóa thành công

        } catch (DataIntegrityViolationException e) {
            // Trả về 409 Conflict nếu vi phạm ràng buộc khóa ngoại (đang có sản phẩm)
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Không thể xóa! Danh mục này đang chứa sản phẩm.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Đã xảy ra lỗi hệ thống khi xóa!");
        }
    }
}
