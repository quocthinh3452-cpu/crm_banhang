package org.example.crm_be.module.product.infrastructure.persistence;

import lombok.AllArgsConstructor;
import org.example.crm_be.module.product.application.mapper.ProductTypeMapper;
import org.example.crm_be.module.product.domain.entity.ProductType;
import org.example.crm_be.module.product.domain.repository.ProductTypeRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@AllArgsConstructor
public class ProductTypeRepositoryImpl implements ProductTypeRepository {

    private final ProductTypeJpaRepository jpaRepository;
    private final ProductTypeMapper dbMapper;



    @Override
    public List<ProductType> findAll() {
        return jpaRepository.findAll().stream()
                .map(dbMapper::toDomain) // Tách ra hàm private cho sạch code
                .collect(Collectors.toList());
    }

    @Override
    public Optional<ProductType> findById(Long id) {
        return jpaRepository.findById(id).map(dbMapper::toDomain);
    }

    // Hàm bổ trợ để chuyển đổi (Mapping)

    @Override
    public boolean existsByTypeName(String typeName) {
        return jpaRepository.existsByTypeName(typeName);
    }

    @Override
    public ProductType save(ProductType productType) {
        // 1. Map từ Domain Entity sang DB Entity
        ProductTypeDbEntity dbEntity = dbMapper.toDbEntity(productType);

        // 2. Lưu vào MySQL
        ProductTypeDbEntity savedEntity = jpaRepository.save(dbEntity);

        // 3. Map ngược lại sang Domain để trả về
        return dbMapper.toDomain(savedEntity);
    }
    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id); // Gọi hàm có sẵn của JpaRepository
    }

}
