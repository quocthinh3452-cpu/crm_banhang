package org.example.crm_be.module.QLBG.application.dto.output;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class QuoteResponse {
    private int id;
    private int leadId;
    private String quoteNumber;
    private String customerName;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate quoteDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate validUntil;

    private BigDecimal grandTotal;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal tax;
    private String stage;
    private String approvalStatus;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    private List<QuoteItemResponse> items;
}
