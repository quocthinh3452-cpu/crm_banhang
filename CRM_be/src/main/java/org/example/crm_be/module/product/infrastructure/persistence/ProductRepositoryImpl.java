package org.example.crm_be.module.product.infrastructure.persistence;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.product.application.mapper.ProductMapper;
import org.example.crm_be.module.product.domain.entity.PageResult;
import org.example.crm_be.module.product.domain.entity.Product;
import org.example.crm_be.module.product.domain.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class ProductRepositoryImpl implements ProductRepository {
    private final ProductJpaRepository jpaRepository;
    private final ProductMapper dbMapper;



    @Override
    public Product save(Product product) {
        ProductDbEntity dbEntity = dbMapper.mapToDb(product);
        ProductDbEntity savedEntity = jpaRepository.save(dbEntity);
        return dbMapper.mapToDomain(savedEntity);
    }

    @Override
    public Optional<Product> findById(Long id) {
        return jpaRepository.findById(id).map(dbMapper::mapToDomain);
    }

    @Override
    public List<Product> findAll() {
        return jpaRepository.findAll().stream()
                .map(dbMapper::mapToDomain)
                .collect(Collectors.toList());
    }
    @Override
    public boolean existsByProductCode(String code) {
        return jpaRepository.existsByProductCode(code);
    }

    @Override
    public Optional<Product> findByProductCode(String code) {
        return jpaRepository.findByProductCode(code)
                .map(dbMapper::mapToDomain);
    }

    @Override
    public Optional<Product> findByProductCodeIgnoreCase(String productCode) {
        // Đảm bảo jpaRepository có hàm findByProductCodeIgnoreCase
        return jpaRepository.findByProductCodeIgnoreCase(productCode)
                .map(dbMapper::mapToDomain);
    }

    @Override
    public void softDelete(Long id) {
        // Gọi hàm xóa mềm trong JpaRepository
        jpaRepository.softDeleteProduct(id);
    }

    @Override
    public void restore(Long id) {
        jpaRepository.restoreById(id);
    }

    @Override
    public List<Product> searchAndSort(String keyword, Long typeId, String sortField, String sortDir) {
        Sort sort = (sortDir != null && sortDir.equalsIgnoreCase("asc"))
                ? Sort.by(sortField != null ? sortField : "id").ascending()
                : Sort.by(sortField != null ? sortField : "id").descending();

        List<ProductDbEntity> entities = jpaRepository.searchAndSortProducts(keyword, typeId, sort);
        return entities.stream()
                .map(dbMapper::mapToDomain)
                .collect(Collectors.toList());
    }

    @Override
    public PageResult<Product> getProducts(int page, int size, String keyword, Long typeId,
                                           BigDecimal minPrice, BigDecimal maxPrice,
                                           LocalDateTime start, LocalDateTime end,
                                           String sortBy, String sortDir) {

        Sort sort = (sortDir != null && sortDir.equalsIgnoreCase("asc"))
                ? Sort.by(sortBy != null ? sortBy : "id").ascending()
                : Sort.by(sortBy != null ? sortBy : "id").descending();

        Pageable pageable = PageRequest.of(page - 1, size, sort);

        Page<ProductDbEntity> pageData = jpaRepository.searchProductsFull(
                keyword, typeId, minPrice, maxPrice, start, end, pageable
        );

        List<Product> domainItems = pageData.getContent().stream()
                .map(dbMapper::mapToDomain)
                .collect(Collectors.toList());

        return new PageResult<>(
                domainItems,
                pageData.getTotalPages(),
                page,
                pageData.getTotalElements()
        );
    }
    @Override
    public Optional<Product> findByProductCodeIgnoreSoftDelete(String code) {
        // 1. Gọi hàm SQL từ jpaRepository
        // 2. Dùng dbMapper để biến ProductDbEntity thành Product của tầng Domain
        return jpaRepository.findByProductCodeIgnoreSoftDelete(code)
                .map(dbMapper::mapToDomain);
    }
}
