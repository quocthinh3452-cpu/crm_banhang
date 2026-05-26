package org.example.crm_be.module.QLHD.application.usecase;

import org.example.crm_be.module.QLHD.application.dto.output.ContractResponse;

public interface IUpdateContractStatus {
    ContractResponse execute(int id, String status);
}
