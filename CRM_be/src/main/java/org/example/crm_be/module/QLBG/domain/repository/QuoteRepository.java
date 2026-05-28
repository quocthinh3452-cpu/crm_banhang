package org.example.crm_be.module.QLBG.domain.repository;

import org.example.crm_be.module.QLBG.domain.entity.Quote;
import org.example.crm_be.module.QLBG.domain.entity.QuoteStatus;
import java.util.Optional;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface QuoteRepository {
    Quote save(Quote quote);
    Optional<Quote> findByQuoteNumber(String quoteNumber);
    Optional<Quote> findById(int id);
    Page<Quote> findAll(Pageable pageable);
    void deleteById(Integer id);
    Page<Quote> findByQuoteNumberContainingIgnoreCase(String keyword, Pageable pageable);
    Page<Quote> searchQuotes(String keyword, QuoteStatus status, BigDecimal minTotal, BigDecimal maxTotal, LocalDate startDate, LocalDate endDate, Pageable pageable);
}
