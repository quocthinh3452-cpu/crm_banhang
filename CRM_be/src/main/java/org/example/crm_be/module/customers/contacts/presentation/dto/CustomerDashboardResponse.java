package org.example.crm_be.module.customers.contacts.presentation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CustomerDashboardResponse {

    private long totalContacts;

    private long totalInteractions;

    private long totalDocuments;

    private long totalComplaints;
}