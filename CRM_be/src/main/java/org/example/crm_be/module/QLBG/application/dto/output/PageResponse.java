package org.example.crm_be.module.QLBG.application.dto.output;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class PageResponse<T> {
    private List<T> content;          // Danh sách dữ liệu (10, 20 bản ghi...)
    private int pageNumber;           // Trang hiện tại
    private int pageSize;             // Số bản ghi mỗi trang
    private long totalElements;       // Tổng số bản ghi trong DB (ví dụ: 10,000)
    private int totalPages;           // Tổng số trang
    private boolean last;              // Có phải trang cuối không
}
