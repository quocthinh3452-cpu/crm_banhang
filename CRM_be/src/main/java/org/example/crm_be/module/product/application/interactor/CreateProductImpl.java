package org.example.crm_be.module.product.application.interactor;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.example.crm_be.module.product.application.dto.input.ProductRequest;
import org.example.crm_be.module.product.application.dto.output.ProductResponse;
import org.example.crm_be.module.product.application.mapper.ProductMapper;
import org.example.crm_be.module.product.application.usecase.ICheckProductSoftDeleted;
import org.example.crm_be.module.product.application.usecase.ICreateProduct;
import org.example.crm_be.module.product.application.usecase.IRestoreProduct;
import org.example.crm_be.module.product.domain.entity.Product;
import org.example.crm_be.module.product.domain.repository.ProductRepository;
import org.example.crm_be.module.product.domain.service.ProductValidator;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CreateProductImpl implements ICreateProduct {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final ProductValidator productValidator;
    private final ICheckProductSoftDeleted checkProductSoftDeleted;
    private final IRestoreProduct restoreProduct;

    @Override
    @Transactional
    public ProductResponse execute(ProductRequest request, String fileName) {

        // 1. KIỂM TRA XÓA MỀM VÀ PHỤC HỒI
        if (checkProductSoftDeleted.execute(request.getProductCode())) {
            // Giả định hàm restoreProduct của bạn nhận vào productCode
            // Nếu hàm của bạn nhận vào ID, bạn cần viết thêm 1 hàm tìm ID dựa trên Mã trước nhé.
            ProductResponse restoredProduct = restoreProduct.execute(request.getProductCode());

            // Trả về luôn sản phẩm đã phục hồi, thoát khỏi luồng Create
            return restoredProduct;
        }

        // 2. Nếu không bị xóa mềm, tiếp tục chặn các trường hợp trùng mã đang Active
        productValidator.validateUniqueness(request.getProductCode());

        // 3. Dùng mapper để chuyển DTO sang Entity (đã map sẵn name, price, typeId...)
        Product product = productMapper.toEntity(request);

        // 4. Thiết lập dữ liệu ngoài và trạng thái mặc định
        product.setImageUrl(fileName);

        // 🌟 Áp dụng DDD: Dùng hàm nghiệp vụ để khởi tạo trạng thái thay vì Setter
        product.initializeForCreation();

        // 5. Kiểm tra tính hợp lệ toàn vẹn trước khi lưu
        product.validate();

        // 6. Lưu xuống DB
        Product savedProduct = productRepository.save(product);

        // 7. Trả về DTO cho Controller
        return productMapper.toResponse(savedProduct);
    }
}
