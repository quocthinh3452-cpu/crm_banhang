package org.example.crm_be.module.QLBG.application.interactor;

import org.example.crm_be.module.QLBG.application.usecase.IDeleteQuote;
import org.example.crm_be.module.QLBG.domain.entity.Quote;
import org.example.crm_be.module.QLBG.domain.repository.QuoteRepository;

public class DeleteQuoteImpl implements IDeleteQuote {
    private final QuoteRepository quoteRepository;

    public DeleteQuoteImpl(QuoteRepository quoteRepository) {
        this.quoteRepository = quoteRepository;
    }

    @Override
    public void execute(Integer id) {
        // 1. Sửa QuoteDbEntity thành Quote (Domain Entity)
        Quote quote = quoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy báo giá"));

        // 2. Kiểm tra trạng thái dựa trên Domain Object
        if ("Approved".equals(quote.getStatus())) {
            throw new RuntimeException("Không thể xóa báo giá đã duyệt!");
        }

        // 3. Gọi hàm deleteById đã được thêm vào interface
        quoteRepository.deleteById(id);
    }
}
