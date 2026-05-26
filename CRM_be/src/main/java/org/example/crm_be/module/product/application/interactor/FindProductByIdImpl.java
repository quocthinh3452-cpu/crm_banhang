package org.example.crm_be.module.product.application.interactor;

import org.example.crm_be.module.product.application.usecase.IFindProductById;
import org.example.crm_be.module.product.domain.entity.Product;
import org.example.crm_be.module.product.domain.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
@Service
public class FindProductByIdImpl implements IFindProductById {
    private final ProductRepository productRepository;
    public FindProductByIdImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    @Override
    public Optional<Product> execute(Long id) {
        return productRepository.findById(id);
    }
}
