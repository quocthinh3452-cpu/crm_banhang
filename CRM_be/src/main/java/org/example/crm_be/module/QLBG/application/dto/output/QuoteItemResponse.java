package org.example.crm_be.module.QLBG.application.dto.output;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class QuoteItemResponse {
    private Long productId;
    private String productName;
    private int quantity;
    private BigDecimal unitPrice;
    private double discountPercent;
    private BigDecimal total;
}
