package org.example.crm_be.module.QLHD.infrastructure.persistence;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.QLHD.application.mapper.ContractMapper;
import org.example.crm_be.module.QLHD.domain.entity.Contract;
import org.example.crm_be.module.QLHD.domain.repository.ContractRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ContractRepositoryImpl implements ContractRepository {

    private final ContractJpaRepository jpaRepository;
    private final ContractMapper mapper;

    @Override
    public Contract save(Contract contract) {
        ContractDbEntity dbEntity = mapper.toDbEntity(contract);
        ContractDbEntity saved = jpaRepository.save(dbEntity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<Contract> findById(int id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public Page<Contract> findAll(Pageable pageable) {
        return jpaRepository.findAll(pageable)
                .map(mapper::toDomain);
    }

    @Override
    public void deleteById(Integer id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public Page<Contract> searchContracts(
            String keyword,
            String status,
            java.math.BigDecimal minValue,
            java.math.BigDecimal maxValue,
            java.time.LocalDate startDate,
            java.time.LocalDate endDate,
            java.time.LocalDate today,
            java.time.LocalDate thirtyDaysAhead,
            Pageable pageable
    ) {
        return jpaRepository.searchContracts(keyword, status, minValue, maxValue, startDate, endDate, today, thirtyDaysAhead, pageable)
                .map(mapper::toDomain);
    }
}
