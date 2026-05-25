package org.example.crm_be.module.product.application.interactor;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.example.crm_be.module.product.application.dto.output.ProductResponse;
import org.example.crm_be.module.product.application.mapper.ProductMapper;
import org.example.crm_be.module.product.application.usecase.IRestoreProduct;
import org.example.crm_be.module.product.domain.entity.Product;
import org.example.crm_be.module.product.domain.repository.ProductRepository;
import org.example.crm_be.module.product.exception.ProductNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class RestoreProductImpl implements IRestoreProduct {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public ProductResponse execute(String productCode) {
        // 1. Tìm sản phẩm (dùng hàm bỏ qua filter xóa mềm mà ta đã tạo)
        Product product = productRepository.findByProductCodeIgnoreSoftDelete(productCode)
                .orElseThrow(() -> new ProductNotFoundException("Không tìm thấy sản phẩm với mã: " + productCode));

        // 2. Cập nhật lại trạng thái thành đang hoạt động
        // (Tùy entity của bạn, ví dụ set isDeleted = false, hoặc isActive = 1)
        product.setIsDeleted(0);

        // 3. Lưu xuống Database
        Product savedProduct = productRepository.save(product);

        // 4. Trả về Response
        return productMapper.toResponse(savedProduct);
    }
}