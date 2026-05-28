package org.example.crm_be.module.customers.application.interactor;

import lombok.RequiredArgsConstructor;

import org.example.crm_be.module.customers.application.dto.output.CustomerOutput;

import org.example.crm_be.module.customers.application.usecase.GetAllCustomersUseCase;

import org.example.crm_be.module.customers.domain.entity.Customer;

import org.example.crm_be.module.customers.domain.repository.CustomerRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor

public class GetAllCustomersInteractor
        implements GetAllCustomersUseCase {

    private final CustomerRepository repository;
    private final org.example.crm_be.module.lead.infrastructure.persistence.SpringDataLeadRepository leadRepository;

    @Override
    public List<CustomerOutput> execute(
            String search,
            String type,
            String tier,
            String status
    ) {

        return repository.findAll()
                .stream()

                .filter(customer -> {
                    if (customer.getLeadId() == null) {
                        return false;
                    }
                    return leadRepository.findById(customer.getLeadId())
                            .map(lead -> lead.getStatus() == org.example.crm_be.module.lead.domain.entity.LeadStatus.CONVERTED)
                            .orElse(false);
                })

                .filter(customer ->
                        search == null ||
                                (customer.getName() != null &&
                                        customer.getName().toLowerCase()
                                                .contains(search.toLowerCase()))
                )

                .filter(customer ->
                        type == null ||
                                (customer.getType() != null &&
                                        customer.getType().equalsIgnoreCase(type))
                )

                .filter(customer ->
                        tier == null ||
                                (customer.getTier() != null &&
                                        customer.getTier().equalsIgnoreCase(tier))
                )

                .filter(customer ->
                        status == null ||
                                (customer.getStatus() != null &&
                                        customer.getStatus().equalsIgnoreCase(status))
                )

                .filter(customer ->
                        customer.getDeleted() == null ||
                                !customer.getDeleted()
                )

                .map(customer ->
                        CustomerOutput.builder()
                                .id(customer.getId())
                                .customerCode(customer.getCustomerCode())
                                .name(customer.getName())
                                .type(customer.getType())
                                .tier(customer.getTier())
                                .phone(customer.getPhone())
                                .email(customer.getEmail())
                                .taxCode(customer.getTaxCode())
                                .address(customer.getAddress())
                                .status(customer.getStatus())
                                .note(customer.getNote())
                                .budget(customer.getBudget())
                                .leadId(customer.getLeadId())
                                .build()
                )
                .toList();
    }
}