package org.example.crm_be.module.product.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductType {
    private Long id;
    private String typeName;
    private Integer isActive;
}
