package org.example.crm_be.module.product.application.interactor;

import jakarta.transaction.Transactional;
import org.example.crm_be.module.product.application.usecase.IDeleteProduct;
import org.example.crm_be.module.product.domain.repository.ProductRepository;
import org.springframework.stereotype.Service;

@Service
public class DeleteProductImpl implements IDeleteProduct {
    private final ProductRepository productRepository;

    public DeleteProductImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    @Transactional // Rất quan trọng khi dùng @Modifying UPDATE
    public void execute(Long id) {
        productRepository.softDelete(id);
    }
}
