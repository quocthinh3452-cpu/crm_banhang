package org.example.crm_be.module.lead.presentation.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller providing lookup APIs for reference tables:
 * provinces, lead_sources, sales_groups.
 * Uses JdbcTemplate to simplify access without needing separate Entity/Repository.
 */
@RestController
@RequestMapping("/api/v1/lookup")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@SuppressWarnings({"SqlResolve", "SqlNoDataSourceInspection"})
public class LookupController {

    private final JdbcTemplate jdbcTemplate;

    public LookupController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Get all provinces
     * GET /api/v1/lookup/provinces
     */
    @GetMapping("/provinces")
    public ResponseEntity<List<Map<String, Object>>> getProvinces() {
        List<Map<String, Object>> result = jdbcTemplate.queryForList("SELECT id, name FROM provinces ORDER BY name");
        return ResponseEntity.ok(result);
    }

    /**
     * Get all lead sources
     * GET /api/v1/lookup/sources
     */
    @GetMapping("/sources")
    public ResponseEntity<List<Map<String, Object>>> getSources() {
        List<Map<String, Object>> result = jdbcTemplate.queryForList("SELECT id, name FROM lead_sources ORDER BY name");
        return ResponseEntity.ok(result);
    }

    /**
     * Get all sales groups
     * GET /api/v1/lookup/sales-groups
     */
    @GetMapping("/sales-groups")
    public ResponseEntity<List<Map<String, Object>>> getSalesGroups() {
        List<Map<String, Object>> result = jdbcTemplate.queryForList("SELECT id, name FROM sales_groups ORDER BY name");
        return ResponseEntity.ok(result);
    }
}
