package org.example.crm_be.module.product.exception;

public class ProductDeletedException extends RuntimeException {
    public ProductDeletedException(String code) {
        super(code);
    }
}
