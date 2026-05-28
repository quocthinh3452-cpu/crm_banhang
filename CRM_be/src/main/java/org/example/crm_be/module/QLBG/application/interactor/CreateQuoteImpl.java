package org.example.crm_be.module.QLBG.application.interactor;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.QLBG.application.dto.input.QuoteRequest;
import org.example.crm_be.module.QLBG.application.dto.output.QuoteResponse;
import org.example.crm_be.module.QLBG.application.usecase.ICreateQuote;
import org.example.crm_be.module.QLBG.application.mapper.QuoteMapper;
import org.example.crm_be.module.QLBG.domain.entity.Quote;
import org.example.crm_be.module.QLBG.domain.entity.QuoteDetail;
import org.example.crm_be.module.QLBG.domain.repository.QuoteRepository;
import org.example.crm_be.common.persistence.ProductJpaRepository;
import org.example.crm_be.common.persistence.ProductDbEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CreateQuoteImpl implements ICreateQuote {
    private final QuoteRepository quoteRepository;
    private final QuoteMapper quoteMapper;
    private final ProductJpaRepository productJpaRepository;

    @Override
    public QuoteResponse execute(QuoteRequest request) {
        // 1. Chuyển thông tin chung từ DTO sang Domain Entity
        Quote quote = quoteMapper.toEntity(request);

        // 2. XỬ LÝ CHI TIẾT SẢN PHẨM: Đảm bảo dữ liệu không bị "rơi"
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            List<QuoteDetail> details = request.getItems().stream()
                    .map(itemDto -> {
                        QuoteDetail detail = new QuoteDetail();
                        detail.setProductId(itemDto.getProductId());
                        detail.setProductName(productJpaRepository.findById(itemDto.getProductId()).map(ProductDbEntity::getName).orElse("Sản phẩm #" + itemDto.getProductId()));
                        detail.setQuantity(BigDecimal.valueOf(itemDto.getQuantity())); // Khớp kiểu BigDecimal
                        detail.setUnitPrice(itemDto.getUnitPrice());
                        detail.setDiscountPercent(itemDto.getDiscountPercent());
                        return detail;
                    }).collect(Collectors.toList());

            quote.setDetails(details); // Gắn danh sách sản phẩm vào báo giá
        }

        // 3. KIỂM TRA TÍNH HỢP LỆ (VALIDATION)
        validateQuote(quote, request);

        // 4. TÍNH TOÁN TỰ ĐỘNG TRÊN SERVER
        quote.calculateTotals();

        // 5. LƯU XUỐNG DATABASE
        Quote savedQuote = quoteRepository.save(quote);

        // 6. Trả về kết quả đã map sang DTO để hiển thị thông báo thành công
        return quoteMapper.toResponse(savedQuote);
    }

    private void validateQuote(Quote quote, QuoteRequest request) {
        // Kiểm tra mã báo giá trùng
        if (quote.getQuoteNumber() != null && quoteRepository.findByQuoteNumber(quote.getQuoteNumber()).isPresent()) {
            throw new IllegalArgumentException("⚠️ Lỗi: Mã báo giá \"" + quote.getQuoteNumber() + "\" đã tồn tại trong hệ thống!");
        }

        // Kiểm tra danh sách sản phẩm
        if (quote.getDetails() == null || quote.getDetails().isEmpty()) {
            throw new RuntimeException("⚠️ Lỗi: Báo giá phải có ít nhất một sản phẩm!");
        }

        // Kiểm tra logic ngày tháng
        if (request.getValidUntil() != null && request.getValidUntil().isBefore(request.getQuoteDate())) {
            throw new RuntimeException("⚠️ Lỗi: Ngày hết hạn không thể trước ngày lập báo giá!");
        }

        // Ràng buộc Trạng thái duyệt vs Giai đoạn bán hàng
        List<String> restrictedStages = List.of("Negotiating", "Sent", "Accepted");
        boolean isNotApproved = !"Approved".equals(request.getApprovalStatus());

        if (isNotApproved && restrictedStages.contains(request.getStage())) {
            throw new RuntimeException("⚠️ Quy tắc: Cần duyệt nội bộ trước khi sang giai đoạn: " + request.getStage());
        }
    }
}
