package org.example.crm_be.module.QLHD.application.interactor;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.QLBG.application.dto.output.PageResponse;
import org.example.crm_be.module.QLHD.application.dto.output.ContractResponse;
import org.example.crm_be.module.QLHD.application.usecase.IGetAllContracts;
import org.example.crm_be.module.QLHD.application.mapper.ContractMapper;
import org.example.crm_be.module.QLHD.domain.entity.Contract;
import org.example.crm_be.module.QLHD.domain.repository.ContractRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetAllContractsImpl implements IGetAllContracts {

    private final ContractRepository contractRepository;
    private final ContractMapper contractMapper;

    @Override
    public PageResponse<ContractResponse> execute(
            Pageable pageable,
            String keyword,
            String status,
            java.math.BigDecimal minValue,
            java.math.BigDecimal maxValue,
            java.time.LocalDate startDate,
            java.time.LocalDate endDate
    ) {
        // 1. Khởi tạo mốc thời gian hiện tại
        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.LocalDate thirtyDaysAhead = today.plusDays(30);

        // 2. Query danh sách phân trang nâng cao từ repository
        Page<Contract> contractPage = contractRepository.searchContracts(
                keyword, 
                status, 
                minValue, 
                maxValue, 
                startDate, 
                endDate, 
                today, 
                thirtyDaysAhead, 
                pageable
        );

        // 3. Chuyển đổi nội dung sang Response DTO
        List<ContractResponse> content = contractPage.getContent().stream()
                .map(contractMapper::toResponse)
                .collect(Collectors.toList());

        // 4. Đóng gói kết quả dạng PageResponse
        return new PageResponse<>(
            content,
            contractPage.getNumber(),
            contractPage.getSize(),
            contractPage.getTotalElements(),
            contractPage.getTotalPages(),
            contractPage.isLast()
        );
    }
}
