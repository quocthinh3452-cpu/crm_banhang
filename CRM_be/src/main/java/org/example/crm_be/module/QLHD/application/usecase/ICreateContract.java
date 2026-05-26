package org.example.crm_be.module.QLHD.application.usecase;

import org.example.crm_be.module.QLHD.application.dto.input.ContractRequest;
import org.example.crm_be.module.QLHD.application.dto.output.ContractResponse;

public interface ICreateContract {
    ContractResponse execute(ContractRequest request);
}
