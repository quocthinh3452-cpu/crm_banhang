package org.example.crm_be.module.lead.domain.repository;

import org.example.crm_be.module.lead.domain.entity.Lead;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface LeadRepository {
    Page<Lead> findAll(LeadSearchCriteria criteria, Pageable pageable);
    Optional<Lead> findById(Integer id); // Đã sửa từ Long thành Integer
    Lead save(Lead lead);
    void deleteById(Integer id); // Đã sửa từ Long thành Integer
}