package org.example.crm_be.module.product.infrastructure.config;

import org.example.crm_be.module.product.application.interactor.*;
import org.example.crm_be.module.product.application.mapper.ProductMapper;
import org.example.crm_be.module.product.application.mapper.ProductTypeMapper;
import org.example.crm_be.module.product.application.usecase.*;
import org.example.crm_be.module.product.domain.repository.ProductRepository;
import org.example.crm_be.module.product.domain.repository.ProductTypeRepository;
import org.example.crm_be.module.product.domain.service.ProductValidator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProductBeanConfig {
    @Bean
    public ICreateProduct createProduct(
            ProductRepository repository,
            ProductMapper mapper,
            ProductValidator productValidator,
            ICheckProductSoftDeleted checkProductSoftDeleted,
            IRestoreProduct restoreProduct) {

        return new CreateProductImpl(repository, mapper, productValidator, checkProductSoftDeleted, restoreProduct);
    }

    @Bean
    public ProductMapper productMapper() {
        return new ProductMapper();
    }
    @Bean
    public IGetAllProducts getAllProducts(ProductRepository repository, ProductMapper mapper) {
        return new GetAllProductsImpl(repository, mapper);
    }
    @Bean
    public ProductTypeMapper productTypeMapper() {
        return new ProductTypeMapper();
    }
    @Bean
    public IGetAllProductTypes getAllProductTypes(ProductTypeRepository repository, ProductTypeMapper mapper) {
        return new GetAllProductTypesImpl(repository, mapper);
    }
//    @Bean
//    public ICheckProductCode checkProductCode(ProductRepository repository) {
//        return new CheckProductCodeImpl(repository);
//    }
    @Bean
    public IDeleteProduct deleteProduct(ProductRepository repository) {
        return new DeleteProductImpl(repository);
    }
    @Bean
    public IRestoreProduct restoreProduct(ProductRepository repository, ProductMapper mapper) {

        return new RestoreProductImpl(repository, mapper);
    }
//    @Bean
//    public IFindProductByCode findProductByCode(ProductRepository repository) {
//        return new FindProductByCodeImpl(repository);
//    }
    @Bean
    public IFindProductById findProductById(ProductRepository repository) {
        return new FindProductByIdImpl(repository);
    }

    @Bean
    public IUpdateProduct updateProduct(ProductRepository repository, ProductMapper mapper, ProductValidator productValidator) {
        return new UpdateProductImpl(repository,mapper,productValidator);
    }
//    @Bean
//    public ISearchProducts searchProducts(ProductRepository repository, ProductMapper mapper){
//        return new SearchProductsImpl(repository,mapper);
 //   }
    @Bean
    public ICreateProductType createProductType(ProductTypeRepository productTypeRepository, ProductTypeMapper productTypeMapper) {
        return new CreateProductTypeImpl(productTypeRepository, productTypeMapper);
    }
    @Bean
    public IDeleteProductType deleteProductType(ProductTypeRepository productTypeRepository) {
        return new DeleteProductTypeImpl(productTypeRepository);
    }
//    @Bean
//    public IGetActiveProductTypes getActiveProductTypes(IGetAllProductTypes getAllProductTypes){
//        return new GetActiveProductTypesImpl(getAllProductTypes);
//    }
//    @Bean
//    public IFileStorageService fileStorageService(){
//        return new FileStorageServiceImpl();
//    }
}

