package org.example.crm_be.module.QLHD.infrastructure.config;

import org.example.crm_be.module.QLHD.application.mapper.ContractMapper;
import org.example.crm_be.module.QLHD.application.usecase.ICreateContract;
import org.example.crm_be.module.QLHD.application.usecase.IGetAllContracts;
import org.example.crm_be.module.QLHD.application.usecase.IUpdateContractStatus;
import org.example.crm_be.module.QLHD.application.interactor.CreateContractImpl;
import org.example.crm_be.module.QLHD.application.interactor.GetAllContractsImpl;
import org.example.crm_be.module.QLHD.application.interactor.UpdateContractStatusImpl;
import org.example.crm_be.module.QLHD.domain.repository.ContractRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ContractBeanConfig {

    @Bean
    public ICreateContract createContractUseCase(ContractRepository contractRepository, ContractMapper contractMapper) {
        return new CreateContractImpl(contractRepository, contractMapper);
    }

    @Bean
    public IGetAllContracts getAllContractsUseCase(ContractRepository contractRepository, ContractMapper contractMapper) {
        return new GetAllContractsImpl(contractRepository, contractMapper);
    }

    @Bean
    public IUpdateContractStatus updateContractStatusUseCase(ContractRepository contractRepository, ContractMapper contractMapper) {
        return new UpdateContractStatusImpl(contractRepository, contractMapper);
    }
}
