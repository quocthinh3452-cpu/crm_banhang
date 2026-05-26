package org.example.crm_be.module.lead.infrastructure.persistence;

import org.example.crm_be.module.lead.domain.entity.LeadInteraction;
import org.example.crm_be.module.lead.domain.repository.LeadInteractionRepository;
import org.example.crm_be.module.lead.infrastructure.persistence.entity.LeadInteractionDbEntity;
import org.example.crm_be.module.lead.infrastructure.persistence.mapper.LeadPersistenceMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class LeadInteractionRepositoryImpl implements LeadInteractionRepository {

    @Autowired private SpringDataLeadInteractionRepository jpaRepository;
    @Autowired private LeadPersistenceMapper mapper;

    @Override
    public List<LeadInteraction> findByLeadId(Integer leadId) { // Đã sửa sang Integer
        return jpaRepository.findByLeadIdOrderByInteractionDateDesc(leadId)
                .stream().map(mapper::toDomainInteraction).collect(Collectors.toList());
    }

    @Override
    public LeadInteraction save(LeadInteraction interaction) {
        LeadInteractionDbEntity entity = mapper.toDbInteraction(interaction);
        return mapper.toDomainInteraction(jpaRepository.save(entity));
    }
}