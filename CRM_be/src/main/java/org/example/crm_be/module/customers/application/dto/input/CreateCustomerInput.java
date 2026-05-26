package org.example.crm_be.module.customers.application.dto.input;

import lombok.Data;

@Data

public class CreateCustomerInput {

    private String customerCode;

    private String name;

    private String type;

    private String tier;

    private String phone;

    private String email;

    private String taxCode;

    private String address;

    private String status;

    private Long budget;

    private String note;
}