package org.example.crm_be.module.QLBG.application.mapper;

import org.example.crm_be.module.QLBG.application.dto.output.QuoteItemResponse;
import org.example.crm_be.module.QLBG.application.dto.input.QuoteRequest;
import org.example.crm_be.module.QLBG.application.dto.output.QuoteResponse;
import org.example.crm_be.module.QLBG.domain.entity.Quote;
import org.example.crm_be.module.QLBG.domain.entity.QuoteDetail;
import org.example.crm_be.module.QLBG.infrastructure.persistence.QuoteDbEntity;
import org.example.crm_be.module.QLBG.infrastructure.persistence.QuoteDetailDbEntity;
import org.example.crm_be.common.persistence.CustomerDbEntity;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import org.example.crm_be.common.persistence.ProductJpaRepository;
import org.example.crm_be.common.persistence.ProductDbEntity;

import java.math.BigDecimal;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class QuoteMapper {
    private final ProductJpaRepository productJpaRepository;

    public Quote toEntity(QuoteRequest request) {
        if (request == null) return null;
        Quote quote = new Quote();
        quote.setQuoteNumber(request.getQuoteNumber());
        quote.setCustomerId(request.getLeadId()); // Đổi từ leadId sang customerId tạm thời
        quote.setDate(request.getQuoteDate());
        quote.setValidityDate(request.getValidUntil());
        // Chuyển approvalStatus thành lowercase để khớp với QuoteStatus enum (draft, negotiating, paused, closed, cancelled, failed)
        String rawStatus = request.getApprovalStatus() != null ? request.getApprovalStatus().toLowerCase() : "draft";
        quote.setStatus(rawStatus);
        quote.setNote(request.getStage());

        if (request.getItems() != null) {
            quote.setDetails(request.getItems().stream().map(item -> {
                QuoteDetail detail = new QuoteDetail();
                detail.setProductId(item.getProductId());
                detail.setProductName(productJpaRepository.findById(item.getProductId()).map(ProductDbEntity::getName).orElse("Sản phẩm #" + item.getProductId()));
                detail.setQuantity(BigDecimal.valueOf(item.getQuantity()));
                detail.setUnitPrice(item.getUnitPrice());
                detail.setDiscountPercent(item.getDiscountPercent());
                return detail;
            }).collect(Collectors.toList()));
        }
        return quote;
    }

    public Quote toDomain(QuoteDbEntity dbEntity) {
        if (dbEntity == null) return null;
        Quote quote = new Quote();
        quote.setId(dbEntity.getId());
        quote.setQuoteNumber(dbEntity.getQuoteNumber());
        if (dbEntity.getCustomer() != null) {
            quote.setCustomerId(dbEntity.getCustomer().getId());
            quote.setCustomerName(dbEntity.getCustomer().getName());
        }
        quote.setDealId(dbEntity.getDealId());
        quote.setTemplateId(dbEntity.getTemplateId());
        quote.setDate(dbEntity.getDate());
        quote.setValidityDate(dbEntity.getValidityDate());
        quote.setStatus(dbEntity.getStatus() != null ? dbEntity.getStatus().name() : "draft");
        quote.setSubtotal(dbEntity.getSubtotal());
        quote.setDiscount(dbEntity.getDiscount());
        quote.setTax(dbEntity.getTax());
        quote.setTotal(dbEntity.getTotal());
        quote.setNote(dbEntity.getNote());
        quote.setCreatedBy(dbEntity.getCreatedBy());
        quote.setCreatedAt(dbEntity.getCreatedAt());

        if (dbEntity.getDetails() != null) {
            quote.setDetails(dbEntity.getDetails().stream().map(d -> {
                QuoteDetail detail = new QuoteDetail();
                detail.setId(d.getId());
                detail.setProductId(d.getProductId());
                String dbName = d.getProductName();
                if (dbName == null || dbName.trim().isEmpty() || dbName.startsWith("Sản phẩm #")) {
                    dbName = productJpaRepository.findById(d.getProductId()).map(ProductDbEntity::getName).orElse(dbName != null ? dbName : "Sản phẩm #" + d.getProductId());
                }
                detail.setProductName(dbName);
                detail.setQuantity(d.getQuantity());
                detail.setUnitPrice(d.getUnitPrice());
                detail.setDiscountPercent(d.getDiscountPercent());
                detail.setLineTotal(d.getTotal());
                return detail;
            }).collect(Collectors.toList()));
        }
        return quote;
    }

    public QuoteResponse toResponse(Quote quote) {
        if (quote == null) return null;
        QuoteResponse response = new QuoteResponse();
        response.setId(quote.getId());
        response.setLeadId(quote.getCustomerId());
        response.setQuoteNumber(quote.getQuoteNumber());
        response.setQuoteDate(quote.getDate());
        response.setValidUntil(quote.getValidityDate());
        response.setApprovalStatus(quote.getStatus());
        response.setStage(quote.getStatus()); // Map tạm cho khớp DTO cũ
        response.setGrandTotal(quote.getTotal());
        response.setSubtotal(quote.getSubtotal());
        response.setDiscount(quote.getDiscount());
        response.setTax(quote.getTax());
        response.setCreatedAt(quote.getCreatedAt());
        response.setCustomerName(quote.getCustomerName());

        if (quote.getDetails() != null) {
            response.setItems(quote.getDetails().stream().map(d -> {
                QuoteItemResponse item = new QuoteItemResponse();
                item.setProductId(d.getProductId());
                item.setProductName(d.getProductName());
                item.setQuantity(d.getQuantity().intValue());
                item.setUnitPrice(d.getUnitPrice());
                item.setDiscountPercent(d.getDiscountPercent().doubleValue());
                item.setTotal(d.getLineTotal());
                return item;
            }).collect(Collectors.toList()));
        }
        return response;
    }

    public QuoteDbEntity toDbEntity(Quote quote) {
        if (quote == null) return null;
        QuoteDbEntity dbEntity = new QuoteDbEntity();
        dbEntity.setId(quote.getId());
        dbEntity.setQuoteNumber(quote.getQuoteNumber());
        if (quote.getCustomerId() > 0) {
            CustomerDbEntity customer = new CustomerDbEntity();
            customer.setId(quote.getCustomerId());
            dbEntity.setCustomer(customer);
        }
        dbEntity.setDealId(quote.getDealId());
        dbEntity.setTemplateId(quote.getTemplateId());
        dbEntity.setDate(quote.getDate());
        dbEntity.setValidityDate(quote.getValidityDate());
        dbEntity.setStatus(quote.getStatus() != null ? org.example.crm_be.module.QLBG.domain.entity.QuoteStatus.valueOf(quote.getStatus().toLowerCase()) : org.example.crm_be.module.QLBG.domain.entity.QuoteStatus.draft);
        dbEntity.setSubtotal(quote.getSubtotal());
        dbEntity.setDiscount(quote.getDiscount());
        dbEntity.setTax(quote.getTax());
        dbEntity.setTotal(quote.getTotal());
        dbEntity.setNote(quote.getNote());
        dbEntity.setCreatedBy(quote.getCreatedBy());

        if (quote.getDetails() != null) {
            dbEntity.setDetails(quote.getDetails().stream().map(d -> {
                QuoteDetailDbEntity detailDb = new QuoteDetailDbEntity();
                detailDb.setProductId(d.getProductId());
                String prodName = d.getProductName();
                if (prodName == null || prodName.trim().isEmpty() || prodName.startsWith("Sản phẩm #")) {
                    prodName = productJpaRepository.findById(d.getProductId()).map(ProductDbEntity::getName).orElse(prodName != null ? prodName : "Sản phẩm #" + d.getProductId());
                }
                detailDb.setProductName(prodName);
                detailDb.setUnitPrice(d.getUnitPrice());
                detailDb.setQuantity(d.getQuantity());
                detailDb.setDiscountPercent(d.getDiscountPercent());
                detailDb.setTotal(d.getLineTotal() != null ? d.getLineTotal() : d.calculateLineTotal()); // Lưu snapshot total dòng
                detailDb.setQuote(dbEntity);
                return detailDb;
            }).collect(Collectors.toList()));
        }
        return dbEntity;
    }
}
