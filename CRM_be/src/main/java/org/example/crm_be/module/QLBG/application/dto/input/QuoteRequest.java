package org.example.crm_be.module.QLBG.application.dto.input;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuoteRequest {
    private String quoteNumber;
    private int leadId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate quoteDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate validUntil;

    private BigDecimal totalAmount;
    private BigDecimal taxAmount;
    private BigDecimal discountAmount;
    private String stage;
    private String approvalStatus;

    // Danh sách sản phẩm từ giao diện gửi lên
    private List<QuoteItemRequest> items;

    // Inner class để nhận dữ liệu từng dòng sản phẩm
    @Getter @Setter
    public static class QuoteItemRequest {
        private Long productId;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal discountPercent;
    }
}
