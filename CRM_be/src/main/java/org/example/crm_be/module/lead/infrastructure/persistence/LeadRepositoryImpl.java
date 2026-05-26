package org.example.crm_be.module.lead.infrastructure.persistence;

import jakarta.persistence.criteria.Predicate;
import org.example.crm_be.module.lead.domain.entity.Lead;
import org.example.crm_be.module.lead.domain.repository.LeadRepository;
import org.example.crm_be.module.lead.domain.repository.LeadSearchCriteria;
import org.example.crm_be.module.lead.infrastructure.persistence.entity.LeadDbEntity;
import org.example.crm_be.module.lead.infrastructure.persistence.mapper.LeadPersistenceMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public class LeadRepositoryImpl implements LeadRepository {

    @Autowired private SpringDataLeadRepository jpaRepository;
    @Autowired private LeadPersistenceMapper mapper;

    @Override
    public Page<Lead> findAll(LeadSearchCriteria criteria, Pageable pageable) {
        Specification<LeadDbEntity> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Xử lý các điều kiện lọc
            if (criteria.getProvinceId() != null)
                predicates.add(cb.equal(root.get("provinceId"), criteria.getProvinceId()));

            if (criteria.getSalesGroupId() != null)
                predicates.add(cb.equal(root.get("salesGroupId"), criteria.getSalesGroupId()));

            if (criteria.getSourceId() != null)
                predicates.add(cb.equal(root.get("sourceId"), criteria.getSourceId()));

            if (criteria.getStatus() != null)
                predicates.add(cb.equal(root.get("status"), criteria.getStatus()));

            if (criteria.getPhone() != null && !criteria.getPhone().isBlank()) {
                String cleanedPhone = criteria.getPhone().trim().replaceAll("\\s+", "");
                predicates.add(cb.like(root.get("phone"), "%" + cleanedPhone + "%"));
            }

            if (criteria.getKeyword() != null && !criteria.getKeyword().isBlank()) {
                String match = "%" + criteria.getKeyword().trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), match),
                        cb.like(cb.lower(root.get("company")), match),
                        cb.like(root.get("phone"), match)
                ));
            }

            // Đảm bảo không trả về null nếu danh sách predicates trống
            return predicates.isEmpty() ? cb.conjunction() : cb.and(predicates.toArray(new Predicate[0]));
        };

        // Spring Data JPA sẽ tự động thực hiện COUNT và LIMIT/OFFSET dựa trên pageable
        Page<LeadDbEntity> pageResult = jpaRepository.findAll(spec, pageable);

        // Map Page<LeadDbEntity> sang Page<Lead> (đối tượng Domain)
        return pageResult.map(mapper::toDomain);
    }

    @Override
    public Optional<Lead> findById(Integer id) { // Đã sửa sang Integer
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Lead save(Lead lead) {
        LeadDbEntity entity = mapper.toDbEntity(lead);
        return mapper.toDomain(jpaRepository.save(entity));
    }

    @Override
    public void deleteById(Integer id) { // Đã sửa sang Integer
        jpaRepository.deleteById(id);
    }
}