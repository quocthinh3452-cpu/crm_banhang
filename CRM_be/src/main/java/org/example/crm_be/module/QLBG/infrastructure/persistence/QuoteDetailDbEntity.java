package org.example.crm_be.module.QLBG.infrastructure.persistence;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "quote_items") // Khớp tên bảng thật
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class QuoteDetailDbEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "quote_id", nullable = false)
    private QuoteDbEntity quote;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "product_name", nullable = false, length = 200) // Lưu snapshot tên SP
    private String productName;

    @Column(name = "unit_price", precision = 15, scale = 2, nullable = false)
    private BigDecimal unitPrice;

    // Trong DB quy định kiểu DECIMAL(10,2) cho số lượng
    @Column(name = "quantity", precision = 10, scale = 2, nullable = false)
    private BigDecimal quantity;

    @Column(name = "discount_percent", precision = 5, scale = 2, nullable = false)
    private BigDecimal discountPercent;

    @Column(name = "total", precision = 15, scale = 2, nullable = false) // Lưu tổng tiền dòng hàng
    private BigDecimal total;
}
