package org.example.crm_be.module.product.application.interactor;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.product.application.dto.input.ProductRequest;
import org.example.crm_be.module.product.application.mapper.ProductMapper;
import org.example.crm_be.module.product.application.usecase.IUpdateProduct;
import org.example.crm_be.module.product.domain.entity.Product;
import org.example.crm_be.module.product.domain.repository.ProductRepository;
import org.example.crm_be.module.product.domain.service.ProductValidator;
import org.example.crm_be.module.product.exception.ProductDeletedException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UpdateProductImpl implements IUpdateProduct {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductValidator productValidator;


    @Override
    @Transactional
    public void execute(Long id, ProductRequest request, String fileName) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm với ID: " + id));

        // 2. Kiểm tra trạng thái kinh doanh (Quy tắc Domain)
        if (!product.isActive()) {
            // Dùng ngay Custom Exception đã tách
            throw new ProductDeletedException(product.getProductCode());
        }

        if (!product.getProductCode().equalsIgnoreCase(request.getProductCode())) {
            productValidator.validateUniqueness(request.getProductCode());
        }
        // 3. Cập nhật dữ liệu
        productMapper.updateEntityFromRequest(request, product);

        // 4. CHỈ cập nhật ảnh NẾU người dùng có upload file mới
        if (fileName != null && !fileName.isEmpty()) {
            product.setImageUrl(fileName);
        }

        // 5. Lưu xuống Database
        productRepository.save(product);
    }
}
