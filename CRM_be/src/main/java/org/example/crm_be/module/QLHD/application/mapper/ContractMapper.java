package org.example.crm_be.module.QLHD.application.mapper;

import org.example.crm_be.module.QLHD.application.dto.input.ContractRequest;
import org.example.crm_be.module.QLHD.application.dto.output.ContractResponse;
import org.example.crm_be.module.QLHD.domain.entity.Contract;
import org.example.crm_be.module.QLHD.infrastructure.persistence.ContractDbEntity;
import org.example.crm_be.module.QLBG.infrastructure.persistence.QuoteDbEntity;
import org.example.crm_be.common.persistence.CustomerDbEntity;
import org.example.crm_be.common.persistence.UserDbEntity;
import org.example.crm_be.module.QLHD.infrastructure.persistence.ContractTemplateDbEntity;
import org.springframework.stereotype.Component;

@Component
public class ContractMapper {

    public Contract toDomain(ContractRequest request) {
        if (request == null) return null;
        Contract contract = new Contract();
        contract.setContractNumber(request.getContractNumber());
        contract.setCustomerId(request.getCustomerId());
        contract.setQuoteId(request.getQuoteId());
        contract.setTemplateId(request.getTemplateId());
        contract.setSignDate(request.getSignDate());
        contract.setExpiryDate(request.getExpiryDate());
        contract.setValue(request.getValue());
        contract.setManagerId(request.getManagerId());
        contract.setStatus(request.getStatus() != null ? request.getStatus() : "active");
        contract.setNote(request.getNote());
        return contract;
    }

    public Contract toDomain(ContractDbEntity dbEntity) {
        if (dbEntity == null) return null;
        Contract contract = new Contract();
        contract.setId(dbEntity.getId());
        contract.setContractNumber(dbEntity.getContractNumber());
        
        if (dbEntity.getCustomer() != null) {
            contract.setCustomerId(dbEntity.getCustomer().getId());
            contract.setCustomerName(dbEntity.getCustomer().getName());
        }
        
        if (dbEntity.getQuote() != null) {
            contract.setQuoteId(dbEntity.getQuote().getId());
        }
        
        if (dbEntity.getTemplate() != null) {
            contract.setTemplateId(dbEntity.getTemplate().getId());
        }
        
        contract.setSignDate(dbEntity.getSignDate());
        contract.setExpiryDate(dbEntity.getExpiryDate());
        contract.setValue(dbEntity.getValue());
        
        if (dbEntity.getManager() != null) {
            contract.setManagerId(dbEntity.getManager().getId());
            contract.setManagerName(dbEntity.getManager().getName());
        }
        
        contract.setStatus(dbEntity.getStatus() != null ? dbEntity.getStatus().name() : "active");
        contract.setNote(dbEntity.getNote());
        contract.setCreatedAt(dbEntity.getCreatedAt());
        contract.setUpdatedAt(dbEntity.getUpdatedAt());
        return contract;
    }

    public ContractResponse toResponse(Contract contract) {
        if (contract == null) return null;
        ContractResponse response = new ContractResponse();
        response.setId(contract.getId());
        response.setContractNumber(contract.getContractNumber());
        response.setCustomerId(contract.getCustomerId());
        response.setCustomerName(contract.getCustomerName());
        response.setQuoteId(contract.getQuoteId());
        response.setTemplateId(contract.getTemplateId());
        response.setSignDate(contract.getSignDate());
        response.setExpiryDate(contract.getExpiryDate());
        response.setValue(contract.getValue());
        response.setManagerId(contract.getManagerId());
        response.setManagerName(contract.getManagerName());
        response.setStatus(contract.getStatus());
        response.setNote(contract.getNote());
        response.setCreatedAt(contract.getCreatedAt());
        return response;
    }

    public ContractDbEntity toDbEntity(Contract contract) {
        if (contract == null) return null;
        ContractDbEntity dbEntity = new ContractDbEntity();
        dbEntity.setId(contract.getId());
        dbEntity.setContractNumber(contract.getContractNumber());
        
        // Cấu hình tạm để lưu khóa ngoại
        if (contract.getCustomerId() > 0) {
            CustomerDbEntity customer = new CustomerDbEntity();
            customer.setId(contract.getCustomerId());
            dbEntity.setCustomer(customer);
        }
        
        if (contract.getQuoteId() != null) {
            QuoteDbEntity quote = new QuoteDbEntity();
            quote.setId(contract.getQuoteId());
            dbEntity.setQuote(quote);
        }
        
        if (contract.getTemplateId() != null) {
            ContractTemplateDbEntity template = new ContractTemplateDbEntity();
            template.setId(contract.getTemplateId());
            dbEntity.setTemplate(template);
        }
        
        dbEntity.setSignDate(contract.getSignDate());
        dbEntity.setExpiryDate(contract.getExpiryDate());
        dbEntity.setValue(contract.getValue());
        
        if (contract.getManagerId() != null) {
            UserDbEntity manager = new UserDbEntity();
            manager.setId(contract.getManagerId());
            dbEntity.setManager(manager);
        }
        
        dbEntity.setStatus(contract.getStatus() != null ? org.example.crm_be.module.QLHD.domain.entity.ContractStatus.valueOf(contract.getStatus().toLowerCase()) : org.example.crm_be.module.QLHD.domain.entity.ContractStatus.active);
        dbEntity.setNote(contract.getNote());
        return dbEntity;
    }
}
