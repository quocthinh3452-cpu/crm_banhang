package org.example.crm_be.module.QLHD.application.interactor;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.QLHD.application.dto.output.ContractResponse;
import org.example.crm_be.module.QLHD.application.usecase.IUpdateContractStatus;
import org.example.crm_be.module.QLHD.application.mapper.ContractMapper;
import org.example.crm_be.module.QLHD.domain.entity.Contract;
import org.example.crm_be.module.QLHD.domain.repository.ContractRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UpdateContractStatusImpl implements IUpdateContractStatus {

    private final ContractRepository contractRepository;
    private final ContractMapper contractMapper;

    @Override
    public ContractResponse execute(int id, String status) {
        // 1. Kiểm tra tồn tại
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("⚠️ Lỗi: Không tìm thấy hợp đồng ID: " + id));

        // 2. Validate trạng thái hợp lệ
        List<String> validStatuses = Arrays.asList("active", "expired", "cancelled");
        if (!validStatuses.contains(status)) {
            throw new RuntimeException("⚠️ Lỗi: Trạng thái hợp đồng không hợp lệ: " + status);
        }

        // 3. Thực hiện cập nhật
        contract.setStatus(status);
        Contract updatedContract = contractRepository.save(contract);

        // 4. Trả về response
        return contractMapper.toResponse(updatedContract);
    }
}
