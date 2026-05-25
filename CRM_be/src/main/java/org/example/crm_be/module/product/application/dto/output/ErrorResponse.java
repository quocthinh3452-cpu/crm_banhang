package org.example.crm_be.module.product.application.dto.output;

public record ErrorResponse (String errorCode,
                             String message,
                             long timestamp) {
    public ErrorResponse(String errorCode, String message) {
        this(errorCode, message, System.currentTimeMillis());
    }

}
