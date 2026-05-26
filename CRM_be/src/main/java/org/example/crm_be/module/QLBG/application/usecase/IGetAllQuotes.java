package org.example.crm_be.module.QLBG.application.usecase;

import org.springframework.data.domain.Pageable;
import org.example.crm_be.module.QLBG.application.dto.output.PageResponse;
import org.example.crm_be.module.QLBG.application.dto.output.QuoteResponse;
import java.math.BigDecimal;
import java.time.LocalDate;

public interface IGetAllQuotes {
    PageResponse<QuoteResponse> execute(
            Pageable pageable, 
            String keyword,
            String status,
            BigDecimal minTotal,
            BigDecimal maxTotal,
            LocalDate startDate,
            LocalDate endDate
    );
}
