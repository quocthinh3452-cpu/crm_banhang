package org.example.crm_be.module.lead.domain.repository;

import org.example.crm_be.module.lead.domain.entity.LeadLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadLogRepository extends JpaRepository<LeadLog, Integer> {
    // Hàm này sẽ tự sinh câu lệnh: SELECT * FROM lead_interactions WHERE lead_id = ? ORDER BY interaction_date DESC
    List<LeadLog> findByLeadIdOrderByInteractionDateDesc(Integer leadId);
}
