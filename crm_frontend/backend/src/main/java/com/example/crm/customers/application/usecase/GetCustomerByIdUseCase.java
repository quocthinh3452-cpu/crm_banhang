package com.example.crm.customers.application.usecase;

import com.example.crm.customers.application.dto.CustomerOutput;

public interface GetCustomerByIdUseCase {

    CustomerOutput getCustomerById(Long id);
}
