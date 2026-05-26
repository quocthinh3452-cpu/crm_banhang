package org.example.crm_be.module.QLBG.application.interactor;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.QLBG.application.dto.output.PageResponse;
import org.example.crm_be.module.QLBG.application.dto.output.QuoteResponse;
import org.example.crm_be.module.QLBG.application.usecase.IGetAllQuotes;
import org.example.crm_be.module.QLBG.application.mapper.QuoteMapper;
import org.example.crm_be.module.QLBG.domain.entity.Quote;
import org.example.crm_be.module.QLBG.domain.repository.QuoteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Tự động tạo constructor cho các trường final để tránh lỗi khởi tạo
public class GetAllQuotesImpl implements IGetAllQuotes {

    private final QuoteRepository quoteRepository;
    private final QuoteMapper quoteMapper;

    @Override
    public PageResponse<QuoteResponse> execute(
            Pageable pageable, 
            String keyword,
            String status,
            java.math.BigDecimal minTotal,
            java.math.BigDecimal maxTotal,
            java.time.LocalDate startDate,
            java.time.LocalDate endDate
    ) {
        // 1. Chuyển đổi status string sang QuoteStatus enum
        org.example.crm_be.module.QLBG.domain.entity.QuoteStatus quoteStatus = null;
        if (status != null && !status.trim().isEmpty()) {
            try {
                quoteStatus = org.example.crm_be.module.QLBG.domain.entity.QuoteStatus.valueOf(status.trim().toLowerCase());
            } catch (IllegalArgumentException e) {
                // Ignore invalid status mapping
            }
        }

        // 2. Query danh sách phân trang nâng cao từ repository
        Page<Quote> quotePage = quoteRepository.searchQuotes(keyword, quoteStatus, minTotal, maxTotal, startDate, endDate, pageable);

        // 3. Map sang Response DTO
        List<QuoteResponse> content = quotePage.getContent().stream()
                .map(quoteMapper::toResponse) // Dùng đúng tên biến quoteMapper
                .collect(Collectors.toList());

        return new PageResponse<>(
            content,
            quotePage.getNumber(),
            quotePage.getSize(),
            quotePage.getTotalElements(),
            quotePage.getTotalPages(),
            quotePage.isLast()
        );
    }
}
