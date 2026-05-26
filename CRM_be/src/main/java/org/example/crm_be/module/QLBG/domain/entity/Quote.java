package org.example.crm_be.module.QLBG.domain.entity;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Quote {
    private int id;
    private String quoteNumber;
    private int customerId;      // Thay leadId
    private Integer dealId;      // Bổ sung
    private Integer templateId;  // Bổ sung
    private String customerName;
    private LocalDate date;      // Đổi từ quoteDate
    private LocalDate validityDate; // Đổi từ validUntil
    private String status;       // Thay thế stage + approvalStatus
    private BigDecimal subtotal; // Thay totalAmount
    private BigDecimal tax;      // Thay taxAmount
    private BigDecimal discount; // Thay discountAmount
    private BigDecimal total;    // Thay grandTotal
    private String note;         // Bổ sung
    private Integer createdBy;   // Bổ sung
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<QuoteDetail> details;

    public void calculateTotals() {
        BigDecimal sub = BigDecimal.ZERO;
        BigDecimal totalDiscount = BigDecimal.ZERO;

        if (details != null) {
            for (QuoteDetail detail : details) {
                BigDecimal lineBase = detail.getUnitPrice().multiply(detail.getQuantity());
                BigDecimal lineDiscount = lineBase.multiply(detail.getDiscountPercent().divide(BigDecimal.valueOf(100)));

                sub = sub.add(lineBase);
                totalDiscount = totalDiscount.add(lineDiscount);
                
                // Gán luôn snapshot lineTotal cho từng dòng hàng
                detail.setLineTotal(lineBase.subtract(lineDiscount));
            }
        }

        this.subtotal = sub;
        this.discount = totalDiscount;
        this.tax = (sub.subtract(totalDiscount)).multiply(BigDecimal.valueOf(0.1)); // Thuế mặc định 10%
        this.total = sub.subtract(totalDiscount).add(this.tax);
    }
}
