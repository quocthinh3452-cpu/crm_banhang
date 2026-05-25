package org.example.crm_be.module.product.application.dto.input;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductTypeReqest {
    private Long id;
    private String typeName;
    private Integer isActive;
}
