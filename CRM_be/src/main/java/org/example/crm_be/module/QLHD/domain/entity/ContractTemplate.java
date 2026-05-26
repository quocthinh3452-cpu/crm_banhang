package org.example.crm_be.module.QLHD.domain.entity;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ContractTemplate {
    private int id;
    private String name;
    private String content;
    private Integer createdBy;
    private LocalDateTime createdAt;
}
