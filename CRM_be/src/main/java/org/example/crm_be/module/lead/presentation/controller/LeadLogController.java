package org.example.crm_be.module.lead.presentation.controller;

import org.example.crm_be.module.lead.domain.entity.LeadLog;
import org.example.crm_be.module.lead.domain.repository.LeadLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/leads")
@CrossOrigin(origins = "*")
public class LeadLogController {

    @Autowired
    private LeadLogRepository leadLogRepository;

    @GetMapping("/{leadId}/logs")
    public ResponseEntity<List<LeadLog>> getLogsByLeadId(@PathVariable Integer leadId) {
        // 1. Tìm tất cả log của Lead này, sắp xếp mới nhất lên đầu
        List<LeadLog> logs = leadLogRepository.findByLeadIdOrderByInteractionDateDesc(leadId);
        return ResponseEntity.ok(logs);
    }

    @PostMapping("/{leadId}/logs")
    public ResponseEntity<LeadLog> createLog(@PathVariable Integer leadId, @RequestBody LeadLog logRequest) {
        // 1. Gán ID của Lead vào log
        logRequest.setLeadId(leadId);

        // 2. Ép về chữ thường ('CALL' -> 'call') để khớp với Enum trong Database của bạn
        if (logRequest.getAction() != null) {
            logRequest.setAction(logRequest.getAction().toLowerCase());
        }

        // 3. Lưu xuống Database!
        LeadLog savedLog = leadLogRepository.save(logRequest);

        // 4. Trả về log đã lưu thành công để Frontend hiển thị
        return ResponseEntity.ok(savedLog);
    }

    // 3. API SỬA LOG
    @PutMapping("/{leadId}/logs/{logId}")
    public ResponseEntity<LeadLog> updateLog(@PathVariable Integer leadId, @PathVariable Integer logId, @RequestBody LeadLog logRequest) {
        return leadLogRepository.findById(logId).map(existingLog -> {
            // Cập nhật nội dung mới
            if (logRequest.getAction() != null) {
                existingLog.setAction(logRequest.getAction().toLowerCase());
            }
            if (logRequest.getNote() != null) {
                existingLog.setNote(logRequest.getNote());
            }
            // Lưu lại vào DB
            LeadLog savedLog = leadLogRepository.save(existingLog);
            return ResponseEntity.ok(savedLog);
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. API XÓA LOG
    @DeleteMapping("/{leadId}/logs/{logId}")
    public ResponseEntity<Void> deleteLog(@PathVariable Integer leadId, @PathVariable Integer logId) {
        if (leadLogRepository.existsById(logId)) {
            leadLogRepository.deleteById(logId);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}