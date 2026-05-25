package org.example.crm_be.module.product.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
public class PageResult<T> {
    private List<T> items;
    private int totalPages;
    private int currentPage;
    private long totalElements;

    public PageResult(List<T> items, int totalPages, int currentPage, long totalElements) {
        this.items = items;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.totalElements = totalElements;
    }
}
