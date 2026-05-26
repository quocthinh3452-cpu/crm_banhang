package org.example.crm_be.module.QLHD.application.dto.input;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ContractRequest {
    private String contractNumber;
    private int customerId;
    private Integer quoteId;
    private Integer templateId;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate signDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate expiryDate;

    private BigDecimal value;
    private Integer managerId;
    private String status;
    private String note;
}
