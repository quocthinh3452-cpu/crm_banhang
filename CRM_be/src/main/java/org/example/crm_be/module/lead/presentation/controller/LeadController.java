package org.example.crm_be.module.lead.presentation.controller;

import org.example.crm_be.module.lead.application.dto.input.*;
import org.example.crm_be.module.lead.application.dto.output.*;
import org.example.crm_be.module.lead.application.usecase.LeadUseCase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api/v1/leads")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LeadController {

    @Autowired private LeadUseCase leadUseCase;

    @GetMapping
    public ResponseEntity<Page<LeadOutput>> getAllLeads(LeadSearchRequest request) {
        return ResponseEntity.ok(leadUseCase.searchLeads(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadOutput> getLeadById(@PathVariable Integer id) { // Đã sửa sang Integer
        return ResponseEntity.ok(leadUseCase.getLeadDetail(id));
    }

    @PostMapping
    public ResponseEntity<LeadOutput> createLead(@RequestBody LeadCreateInput input) {
        return new ResponseEntity<>(leadUseCase.createLead(input), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadOutput> updateLead(@PathVariable Integer id, @RequestBody LeadUpdateInput input) { // Đã sửa sang Integer
        return ResponseEntity.ok(leadUseCase.updateLead(id, input));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable Integer id) { // Đã sửa sang Integer
        leadUseCase.deleteLead(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/interactions")
    public ResponseEntity<List<LeadInteractionOutput>> getInteractions(@PathVariable Integer id) { // Đã sửa sang Integer
        return ResponseEntity.ok(leadUseCase.getInteractions(id));
    }

    @PostMapping("/{id}/interactions")
    public ResponseEntity<LeadInteractionOutput> logInteraction(@PathVariable Integer id, @RequestBody LeadInteractionInput input) { // Đã sửa sang Integer
        return new ResponseEntity<>(leadUseCase.logInteraction(id, input), HttpStatus.CREATED);
    }
}