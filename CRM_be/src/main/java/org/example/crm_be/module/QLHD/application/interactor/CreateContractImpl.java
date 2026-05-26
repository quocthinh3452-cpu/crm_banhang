package org.example.crm_be.module.QLHD.application.interactor;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.QLHD.application.dto.input.ContractRequest;
import org.example.crm_be.module.QLHD.application.dto.output.ContractResponse;
import org.example.crm_be.module.QLHD.application.usecase.ICreateContract;
import org.example.crm_be.module.QLHD.application.mapper.ContractMapper;
import org.example.crm_be.module.QLHD.domain.entity.Contract;
import org.example.crm_be.module.QLHD.domain.repository.ContractRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CreateContractImpl implements ICreateContract {

    private final ContractRepository contractRepository;
    private final ContractMapper contractMapper;

    @Override
    public ContractResponse execute(ContractRequest request) {
        // 1. Chuyển đổi sang Domain Entity
        Contract contract = contractMapper.toDomain(request);

        // 2. Kiểm tra logic nghiệp vụ
        if (contract.getExpiryDate() != null && contract.getExpiryDate().isBefore(contract.getSignDate())) {
            throw new RuntimeException("⚠️ Lỗi: Ngày hết hạn hợp đồng không thể trước ngày ký hợp đồng!");
        }

        if (contract.getValue() == null || contract.getValue().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("⚠️ Lỗi: Giá trị hợp đồng phải lớn hơn hoặc bằng 0!");
        }

        // 3. Lưu xuống cơ sở dữ liệu
        Contract savedContract = contractRepository.save(contract);

        // 4. Trả về DTO hiển thị
        return contractMapper.toResponse(savedContract);
    }
}
