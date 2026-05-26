package org.example.crm_be.module.lead.application.interactor;

import org.example.crm_be.module.lead.domain.entity.Lead;
import org.example.crm_be.module.lead.domain.entity.LeadInteraction;
import org.example.crm_be.module.lead.domain.entity.LeadStatus;
import org.example.crm_be.module.lead.domain.repository.LeadRepository;
import org.example.crm_be.module.lead.domain.repository.LeadInteractionRepository;
import org.example.crm_be.module.lead.domain.repository.LeadSearchCriteria;
import org.example.crm_be.module.lead.application.dto.input.*;
import org.example.crm_be.module.lead.application.dto.output.*;
import org.example.crm_be.module.lead.application.mapper.LeadApplicationMapper;
import org.example.crm_be.module.lead.application.usecase.LeadUseCase;
import org.example.crm_be.common.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
public class LeadInteractor implements LeadUseCase {

    @Autowired private LeadRepository leadRepository;
    @Autowired private LeadInteractionRepository interactionRepository;
    @Autowired private LeadApplicationMapper mapper;

    @Override
    public Page<LeadOutput> searchLeads(LeadSearchRequest request) {
        LeadSearchCriteria criteria = new LeadSearchCriteria();
        criteria.setKeyword(request.getKeyword());
        criteria.setProvinceId(request.getProvinceId());
        criteria.setSalesGroupId(request.getSalesGroupId());
        criteria.setSourceId(request.getSourceId());
        criteria.setPhone(request.getPhone());
        criteria.setStatus(request.getStatus());

        // Sử dụng page từ request (mặc định trang 1 nếu null, và -1 để chuẩn index 0)
        int page = (request.getPage() != null && request.getPage() > 0) ? request.getPage() - 1 : 0;
        int size = (request.getSize() != null && request.getSize() > 0) ? request.getSize() : 10;
        Pageable pageable = PageRequest.of(page, size);

        // Gọi Repository (Yêu cầu hàm findAll trong Repository phải trả về Page<Lead>)
        return leadRepository.findAll(criteria, pageable).map(mapper::toOutput);
    }

    @Override
    public LeadOutput getLeadDetail(Integer id) {
        Lead lead = leadRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Lead ID not found: " + id));
        return mapper.toOutput(lead);
    }

    @Override
    @Transactional
    public LeadOutput createLead(LeadCreateInput input) {
        LocalDateTime now = LocalDateTime.now();
        Lead lead = Lead.builder()
                .name(input.getName()).company(input.getCompany()).phone(input.getPhone()).email(input.getEmail())
                .expectedRevenue(input.getExpectedRevenue()).taxCode(input.getTaxCode()).idCard(input.getIdCard())
                .provinceId(input.getProvinceId()).sourceId(input.getSourceId()).salesGroupId(input.getSalesGroupId())
                .assignedTo(input.getAssignedTo()).serviceInterest(input.getServiceInterest()).note(input.getNote())
                .status(LeadStatus.NEW).createdAt(now).updatedAt(now).build();

        return mapper.toOutput(leadRepository.save(lead));
    }

    @Override
    @Transactional
    public LeadOutput updateLead(Integer id, LeadUpdateInput input) {
        Lead lead = leadRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Lead ID not found: " + id));

        lead.setName(input.getName());
        lead.setCompany(input.getCompany());
        lead.setPhone(input.getPhone());
        lead.setEmail(input.getEmail());
        lead.setExpectedRevenue(input.getExpectedRevenue());
        lead.setTaxCode(input.getTaxCode());

        // ĐÃ SỬA THÀNH setIdCard ĐỂ ĐÚNG SETTER CỦA LOMBOK
        lead.setIdCard(input.getIdCard());

        lead.setProvinceId(input.getProvinceId());
        lead.setSourceId(input.getSourceId());
        lead.setSalesGroupId(input.getSalesGroupId());
        lead.setAssignedTo(input.getAssignedTo());
        lead.setServiceInterest(input.getServiceInterest());
        lead.setStatus(input.getStatus());
        lead.setNote(input.getNote());
        lead.setUpdatedAt(LocalDateTime.now());

        return mapper.toOutput(leadRepository.save(lead));
    }

    @Override
    @Transactional
    public void deleteLead(Integer id) {
        leadRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Lead ID not found: " + id));
        leadRepository.deleteById(id);
    }

    @Override
    @Transactional
    public LeadInteractionOutput logInteraction(Integer leadId, LeadInteractionInput input) {
        leadRepository.findById(leadId).orElseThrow(() -> new ResourceNotFoundException("Lead ID not found: " + leadId));
        LocalDateTime now = LocalDateTime.now();

        LeadInteraction inter = LeadInteraction.builder()
                .leadId(leadId).type(input.getType()).note(input.getNote())
                .interactionDate(input.getInteractionDate() != null ? input.getInteractionDate() : now)
                .createdBy(input.getCreatedBy()).createdAt(now).build();

        return mapper.toInteractionOutput(interactionRepository.save(inter));
    }

    @Override
    public List<LeadInteractionOutput> getInteractions(Integer leadId) {
        return interactionRepository.findByLeadId(leadId).stream().map(mapper::toInteractionOutput).collect(Collectors.toList());
    }
}