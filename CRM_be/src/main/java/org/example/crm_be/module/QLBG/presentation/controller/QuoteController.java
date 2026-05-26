package org.example.crm_be.module.QLBG.presentation.controller;

import org.example.crm_be.module.QLBG.application.dto.output.PageResponse;
import org.example.crm_be.module.QLBG.application.dto.input.QuoteRequest;
import org.example.crm_be.module.QLBG.application.dto.output.QuoteResponse;
import org.example.crm_be.module.QLBG.application.usecase.*;
import org.example.crm_be.module.QLBG.application.mapper.QuoteMapper;
import org.example.crm_be.module.QLBG.domain.entity.Quote;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/api/quotes")
public class QuoteController {

    private final ICreateQuote createQuoteUseCase;
    private final IGetAllQuotes getAllQuotesUseCase;
    private final IDeleteQuote deleteQuoteUseCase;
    private final IUpdateQuote updateQuoteUseCase;
    private final IGetQuote getQuoteUseCase;
    private final QuoteMapper quoteMapper;

    public QuoteController(ICreateQuote createQuoteUseCase, IGetAllQuotes getAllQuotesUseCase, IDeleteQuote deleteQuoteUseCase, IUpdateQuote updateQuoteUseCase, IGetQuote getQuoteUseCase,
                           QuoteMapper quoteMapper) {
        this.createQuoteUseCase = createQuoteUseCase;
        this.getAllQuotesUseCase = getAllQuotesUseCase;
        this.deleteQuoteUseCase = deleteQuoteUseCase;
        this.updateQuoteUseCase = updateQuoteUseCase;
        this.getQuoteUseCase = getQuoteUseCase;
        this.quoteMapper = quoteMapper;
    }

    @PostMapping
    public ResponseEntity<QuoteResponse> createQuote(@RequestBody QuoteRequest request) {
        return ResponseEntity.ok(createQuoteUseCase.execute(request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<QuoteResponse>> getAllQuotes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) java.math.BigDecimal minTotal,
            @RequestParam(required = false) java.math.BigDecimal maxTotal,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate startDate,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate endDate
    ) {
        // 1. Tạo đối tượng phân trang và sắp xếp
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        // 2. TRUYỀN TẤT CẢ THAM SỐ LỌC
        return ResponseEntity.ok(getAllQuotesUseCase.execute(pageable, keyword, status, minTotal, maxTotal, startDate, endDate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuote(@PathVariable Integer id) {
        deleteQuoteUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuoteResponse> updateQuote(
            @PathVariable Integer id,
            @RequestBody QuoteRequest request
    ) {
        // Gọi Use Case xử lý
        return ResponseEntity.ok(updateQuoteUseCase.execute(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuoteResponse> getQuoteById(@PathVariable int id) {
        // Phải map từ Domain sang DTO trước khi trả về
        Quote quote = getQuoteUseCase.execute(id);
        return ResponseEntity.ok(quoteMapper.toResponse(quote));
    }
}
