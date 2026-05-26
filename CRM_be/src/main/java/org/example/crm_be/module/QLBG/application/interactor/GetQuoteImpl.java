package org.example.crm_be.module.QLBG.application.interactor;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.QLBG.application.usecase.IGetQuote;
import org.example.crm_be.module.QLBG.domain.entity.Quote;
import org.example.crm_be.module.QLBG.domain.repository.QuoteRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetQuoteImpl implements IGetQuote {

    private final QuoteRepository quoteRepository;

    @Override
    public Quote execute(int id) {
        // Tìm báo giá trong DB, nếu không thấy thì quăng lỗi
        return quoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy báo giá với ID: " + id));
    }
}
