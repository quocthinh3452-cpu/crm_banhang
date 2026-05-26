package org.example.crm_be.module.product.exception;

public class ProductAlreadyExistsException extends RuntimeException {
    public ProductAlreadyExistsException(String code) {
        super("Sản phẩm mã " + code + " đã tồn tại và đang hoạt động.");
    }
}
