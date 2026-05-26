package org.example.crm_be.module.customers.application.usecase;

import org.example.crm_be.module.customers.application.dto.output.CustomerOutput;

import java.util.List;

public interface GetAllCustomersUseCase {

    List<CustomerOutput> execute();
}