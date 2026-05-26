package com.example.crm.customers.application.dto;

import com.example.crm.customers.domain.Customer;

public class CustomerOutput {

    private Long id;
    private String name;
    private String type;
    private String tier;
    private String phone;
    private String email;
    private String status;
    private Long budget;
    private String createdAt;
    private String updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTier() {
        return tier;
    }

    public void setTier(String tier) {
        this.tier = tier;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getBudget() {
        return budget;
    }

    public void setBudget(Long budget) {
        this.budget = budget;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static CustomerOutput fromEntity(Customer customer) {
        CustomerOutput output = new CustomerOutput();
        output.setId(customer.getId());
        output.setName(customer.getName());
        output.setType(customer.getType());
        output.setTier(customer.getTier());
        output.setPhone(customer.getPhone());
        output.setEmail(customer.getEmail());
        output.setStatus(customer.getStatus());
        output.setBudget(customer.getBudget());
        output.setCreatedAt(customer.getCreatedAt() != null ? customer.getCreatedAt().toString() : null);
        output.setUpdatedAt(customer.getUpdatedAt() != null ? customer.getUpdatedAt().toString() : null);
        return output;
    }
}
