package org.example.crm_be.module.customers.application.usecase;

import org.example.crm_be.module.customers.application.dto.input.CreateCustomerInput;

import org.example.crm_be.module.customers.application.dto.output.CustomerOutput;

public interface CreateCustomerUseCase {

    CustomerOutput execute(
            CreateCustomerInput input
    );
}