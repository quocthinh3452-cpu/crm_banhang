package com.example.crm.customers.application.dto;

public class UpdateCustomerInput extends CreateCustomerInput {

    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
