package org.example.crm_be.module.product.application.interactor;

import org.example.crm_be.module.product.application.dto.output.ProductTypeResponse;
import org.example.crm_be.module.product.application.mapper.ProductTypeMapper;
import org.example.crm_be.module.product.application.usecase.IGetAllProductTypes;
import org.example.crm_be.module.product.domain.repository.ProductTypeRepository;

import java.util.List;
import java.util.stream.Collectors;

public class GetAllProductTypesImpl implements IGetAllProductTypes {
    private final ProductTypeRepository repository;
    private final ProductTypeMapper mapper;

    public GetAllProductTypesImpl(ProductTypeRepository repository, ProductTypeMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public List<ProductTypeResponse> execute() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }
}
