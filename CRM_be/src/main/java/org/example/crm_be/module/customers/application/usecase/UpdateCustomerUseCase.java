package org.example.crm_be.module.customers.application.usecase;

import org.example.crm_be.module.customers.application.dto.input.UpdateCustomerInput;
import org.example.crm_be.module.customers.application.dto.output.CustomerOutput;

public interface UpdateCustomerUseCase {

    CustomerOutput execute(
            Integer id,
            UpdateCustomerInput input
    );
}