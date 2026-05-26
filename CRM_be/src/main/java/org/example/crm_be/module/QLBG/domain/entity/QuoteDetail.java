package org.example.crm_be.module.QLBG.domain.entity;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class QuoteDetail {
    private int id;
    private int quoteId;
    private Long productId;
    private String productName; // Snapshot tên sản phẩm
    private BigDecimal quantity;  // Chuyển sang BigDecimal để khớp định dạng DECIMAL(10,2)
    private BigDecimal unitPrice;
    private BigDecimal discountPercent;
    private BigDecimal taxRate;
    private BigDecimal lineTotal;

    public BigDecimal calculateLineTotal() {
        BigDecimal base = unitPrice.multiply(quantity);
        BigDecimal discountFactor = BigDecimal.ONE.subtract(discountPercent.divide(BigDecimal.valueOf(100)));
        return base.multiply(discountFactor);
    }
}
