package org.example.crm_be.module.QLHD.application.usecase;

import org.example.crm_be.module.QLBG.application.dto.output.PageResponse;
import org.example.crm_be.module.QLHD.application.dto.output.ContractResponse;
import org.springframework.data.domain.Pageable;
import java.math.BigDecimal;
import java.time.LocalDate;

public interface IGetAllContracts {
    PageResponse<ContractResponse> execute(
            Pageable pageable,
            String keyword,
            String status,
            BigDecimal minValue,
            BigDecimal maxValue,
            LocalDate startDate,
            LocalDate endDate
    );
}
