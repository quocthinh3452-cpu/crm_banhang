package org.example.crm_be.module.QLHD.presentation.controller;

import org.example.crm_be.module.QLBG.application.dto.output.PageResponse;
import org.example.crm_be.module.QLHD.application.dto.input.ContractRequest;
import org.example.crm_be.module.QLHD.application.dto.output.ContractResponse;
import org.example.crm_be.module.QLHD.application.usecase.ICreateContract;
import org.example.crm_be.module.QLHD.application.usecase.IGetAllContracts;
import org.example.crm_be.module.QLHD.application.usecase.IUpdateContractStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {

    private final ICreateContract createContractUseCase;
    private final IGetAllContracts getAllContractsUseCase;
    private final IUpdateContractStatus updateContractStatusUseCase;

    public ContractController(ICreateContract createContractUseCase,
                              IGetAllContracts getAllContractsUseCase,
                              IUpdateContractStatus updateContractStatusUseCase) {
        this.createContractUseCase = createContractUseCase;
        this.getAllContractsUseCase = getAllContractsUseCase;
        this.updateContractStatusUseCase = updateContractStatusUseCase;
    }

    @PostMapping
    public ResponseEntity<ContractResponse> createContract(@RequestBody ContractRequest request) {
        return ResponseEntity.ok(createContractUseCase.execute(request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ContractResponse> updateContractStatus(
            @PathVariable int id,
            @RequestParam String status
    ) {
        return ResponseEntity.ok(updateContractStatusUseCase.execute(id, status));
    }

    @GetMapping
    public ResponseEntity<PageResponse<ContractResponse>> getAllContracts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) java.math.BigDecimal minValue,
            @RequestParam(required = false) java.math.BigDecimal maxValue,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate startDate,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate endDate
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ResponseEntity.ok(getAllContractsUseCase.execute(pageable, keyword, status, minValue, maxValue, startDate, endDate));
    }
}
