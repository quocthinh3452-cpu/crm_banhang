package org.example.crm_be.module.product.application.interactor;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.product.application.dto.input.ProductTypeReqest;
import org.example.crm_be.module.product.application.dto.output.ProductTypeResponse;
import org.example.crm_be.module.product.application.mapper.ProductTypeMapper;
import org.example.crm_be.module.product.application.usecase.IUpdateProductType;
import org.example.crm_be.module.product.domain.entity.ProductType;
import org.example.crm_be.module.product.domain.repository.ProductTypeRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateProductTypeImpl implements IUpdateProductType {

    private final ProductTypeRepository productTypeRepository;
    private final ProductTypeMapper productTypeMapper;

    @Override
    @Transactional
    public ProductTypeResponse execute(Long id, ProductTypeReqest request) {

        // 1. Tìm loại sản phẩm cũ trong Database
        ProductType existingType = productTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Loại sản phẩm với ID: " + id));

        // 2. Xử lý trùng lặp Tên loại sản phẩm (Chỉ kiểm tra nếu người dùng thực sự đổi tên)
        if (request.getTypeName() != null && !request.getTypeName().equalsIgnoreCase(existingType.getTypeName())) {

            Optional<ProductType> duplicateTypeOpt = productTypeRepository.findByTypeName(request.getTypeName());

            // BỔ SUNG LOGIC: Báo lỗi nếu trùng tên
            if (duplicateTypeOpt.isPresent()) {
                ProductType duplicateType = duplicateTypeOpt.get();
                if (!duplicateType.getId().equals(id)) {
                    if (duplicateType.getIsActive() != null && duplicateType.getIsActive() == 0) {
                        throw new RuntimeException("Tên loại sản phẩm này đã bị ẩn/xóa. Vui lòng khôi phục lại loại sản phẩm cũ hoặc chọn tên khác.");
                    } else {
                        throw new RuntimeException("Tên loại sản phẩm đã tồn tại đang hoạt động trong hệ thống.");
                    }
                }
            }
        } // ĐÓNG NGOẶC NGAY TẠI ĐÂY (Kết thúc Bước 2)

        // 3. Cập nhật các trường dữ liệu mới từ Request (ĐƯA RA NGOÀI IF)
        if (request.getTypeName() != null) {
            existingType.setTypeName(request.getTypeName());
        }

        // Cập nhật trạng thái isActive
        if (request.getIsActive() != null) {
            existingType.setIsActive(request.getIsActive());
        }

        // 4. Lưu lại xuống Database
        ProductType savedType = productTypeRepository.save(existingType);

        // 5. Chuyển đổi sang Response và trả về
        return productTypeMapper.toResponse(savedType);
    }
}