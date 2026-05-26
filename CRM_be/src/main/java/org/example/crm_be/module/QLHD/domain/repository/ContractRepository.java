package org.example.crm_be.module.QLHD.domain.repository;

import org.example.crm_be.module.QLHD.domain.entity.Contract;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

public interface ContractRepository {
    Contract save(Contract contract);
    Optional<Contract> findById(int id);
    Page<Contract> findAll(Pageable pageable);
    void deleteById(Integer id);
    Page<Contract> searchContracts(
            String keyword,
            String status,
            BigDecimal minValue,
            BigDecimal maxValue,
            LocalDate startDate,
            LocalDate endDate,
            LocalDate today,
            LocalDate thirtyDaysAhead,
            Pageable pageable
    );
}
