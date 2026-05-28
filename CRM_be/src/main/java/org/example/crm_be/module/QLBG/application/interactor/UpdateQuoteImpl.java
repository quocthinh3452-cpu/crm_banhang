package org.example.crm_be.module.QLBG.application.interactor;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.QLBG.application.dto.input.QuoteRequest;
import org.example.crm_be.module.QLBG.application.dto.output.QuoteResponse;
import org.example.crm_be.module.QLBG.application.usecase.IUpdateQuote;
import org.example.crm_be.module.QLBG.application.mapper.QuoteMapper;
import org.example.crm_be.module.QLBG.domain.entity.Quote;
import org.example.crm_be.module.QLBG.domain.repository.QuoteRepository;

@RequiredArgsConstructor
public class UpdateQuoteImpl implements IUpdateQuote {
    private final QuoteRepository quoteRepository;
    private final QuoteMapper quoteMapper;

    @Override
    public QuoteResponse execute(Integer id, QuoteRequest request) {
        // 1. Kiểm tra tồn tại
        Quote oldQuote = quoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy báo giá ID: " + id));

        // 2. RÀNG BUỘC: Không cho sửa nếu báo giá đã chốt
        if ("closed".equalsIgnoreCase(oldQuote.getStatus())) {
            throw new RuntimeException("Quy tắc: Không thể chỉnh sửa báo giá đã chốt!");
        }

        // 3. VALIDATE NGHIỆP VỤ (Ngày tháng, trạng thái...)
        validateRequest(id, request);

        // 4. THỰC HIỆN CẬP NHẬT
        // Đảm bảo mapper đã map cả danh sách items từ request vào newQuote
        Quote newQuote = quoteMapper.toEntity(request);
        newQuote.setId(id);

        // QUAN TRỌNG: Gọi hàm tính toán để lấp đầy total_amount, tax_amount, discount_amount, grand_total
        // Trước khi lưu xuống Database
        newQuote.calculateTotals();

        // 5. Lưu xuống Database
        Quote savedQuote = quoteRepository.save(newQuote);

        // Trả về DTO đã có đầy đủ tiền nong cho giao diện
        return quoteMapper.toResponse(savedQuote);
    }

    // Validate ngày tháng và mã trùng
    private void validateRequest(Integer id, QuoteRequest request) {
        if (request.getQuoteNumber() != null) {
            quoteRepository.findByQuoteNumber(request.getQuoteNumber()).ifPresent(q -> {
                if (q.getId() != id) {
                    throw new IllegalArgumentException("⚠️ Lỗi: Mã báo giá \"" + request.getQuoteNumber() + "\" đã tồn tại trong hệ thống!");
                }
            });
        }
        if (request.getValidUntil() != null && request.getValidUntil().isBefore(request.getQuoteDate())) {
            throw new RuntimeException("Ngày hết hạn phải sau hoặc bằng ngày lập báo giá.");
        }
    }
}
