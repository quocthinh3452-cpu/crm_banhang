package org.example.crm_be.module.lead.domain.entity;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lead {
    private Integer id;
    private String name;
    private String company;
    private String phone;
    private String email;
    private BigDecimal expectedRevenue;
    private String taxCode;
    private String idCard;
    private Integer provinceId;
    private Integer sourceId;
    private Integer salesGroupId;
    private Integer assignedTo;
    private String serviceInterest;
    private LeadStatus status;
    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Đã sửa lại lỗi ở hàm này
    public void assignToSalesperson(Integer userId) {
        this.assignedTo = userId;
        // Đổi thành chữ IN HOA để khớp với file Enum mới
        this.status = LeadStatus.CONTACTING;
        this.updatedAt = LocalDateTime.now();
    }
}