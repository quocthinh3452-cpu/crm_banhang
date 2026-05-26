package org.example.crm_be.module.lead.domain.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class LeadStatusConverter implements AttributeConverter<LeadStatus, String> {

    // 1. Dịch từ Java (NEW) sang Database ('new') khi Lưu dữ liệu (Insert/Update)
    @Override
    public String convertToDatabaseColumn(LeadStatus status) {
        if (status == null) {
            return null;
        }
        return status.name().toLowerCase();
    }

    // 2. Dịch từ Database ('new') sang Java (NEW) khi Lấy dữ liệu lên (Select)
    @Override
    public LeadStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return LeadStatus.valueOf(dbData.toUpperCase());
    }
}