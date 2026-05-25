package org.example.crm_be.module.product.application.interactor;

import org.example.crm_be.module.product.application.usecase.IDeleteProductType;
import org.example.crm_be.module.product.domain.repository.ProductTypeRepository;

public class DeleteProductTypeImpl implements IDeleteProductType {
    private final ProductTypeRepository productTypeRepository;

    public DeleteProductTypeImpl(ProductTypeRepository productTypeRepository) {
        this.productTypeRepository = productTypeRepository;
    }

    @Override
    public void execute(Long id) {
        // Bạn có thể thêm logic kiểm tra trước khi xóa ở đây (vd: ID có tồn tại không)
        productTypeRepository.deleteById(id);
    }
}