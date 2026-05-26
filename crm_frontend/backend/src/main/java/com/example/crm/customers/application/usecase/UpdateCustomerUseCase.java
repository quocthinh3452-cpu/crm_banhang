package com.example.crm.customers.application.usecase;

import com.example.crm.customers.application.dto.CustomerOutput;
import com.example.crm.customers.application.dto.UpdateCustomerInput;

public interface UpdateCustomerUseCase {

    CustomerOutput updateCustomer(Long id, UpdateCustomerInput input);
}
