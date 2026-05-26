package org.example.crm_be.module.product.application.usecase;

public interface ICheckProductSoftDeleted {
    boolean execute(String productCode);
}
