package org.example.crm_be.module.customers.application.dto.output;

import lombok.Builder;
import lombok.Data;

@Data
@Builder

public class CustomerOutput {

    private Long id;

    private String customerCode;

    private String name;

    private String type;

    private String tier;

    private String phone;

    private String email;

    private String taxCode;

    private String address;

    private String status;

    private String note;

    private Long budget;
}