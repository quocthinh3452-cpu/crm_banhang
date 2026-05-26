package com.example.crm.customers.application.usecase;

import com.example.crm.customers.application.dto.CreateCustomerInput;
import com.example.crm.customers.application.dto.CustomerOutput;

public interface CreateCustomerUseCase {

    CustomerOutput createCustomer(CreateCustomerInput input);
}
