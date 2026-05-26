package org.example.crm_be.module.product.application.interactor;

import lombok.AllArgsConstructor;
import org.example.crm_be.module.product.application.usecase.ICheckProductSoftDeleted;
import org.example.crm_be.module.product.domain.entity.Product;
import org.example.crm_be.module.product.domain.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class CheckProductSoftDeletedImpl implements ICheckProductSoftDeleted {

    private final ProductRepository productRepository;

    @Override
    public boolean execute(String productCode) {
        // Tìm sản phẩm bao gồm cả những cái đã xóa
        Optional<Product> productOpt = productRepository.findByProductCodeIgnoreSoftDelete(productCode);

        // Nếu tìm thấy, kiểm tra xem nó có bị xóa chưa (Giả sử Entity có hàm getIsActive(), 0 là đã xóa)
        // LƯU Ý: Đổi getIsActive() == 0 thành getIsDeleted() == true tùy thuộc vào Entity của bạn.
        return productOpt.isPresent() && productOpt.get().getIsDeleted() == 1;
    }
}
