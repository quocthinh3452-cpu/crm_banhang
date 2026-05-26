package org.example.crm_be.module.QLBG.infrastructure.persistence;

import org.example.crm_be.module.QLBG.application.mapper.QuoteMapper;
import org.example.crm_be.module.QLBG.domain.entity.Quote;
import org.example.crm_be.module.QLBG.domain.repository.QuoteRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class QuoteRepositoryImpl implements QuoteRepository {

    private final QuoteJpaRepository jpaRepository;
    private final QuoteMapper mapper;

    // BẮT BUỘC: Thêm Constructor để khởi tạo các trường final
    public QuoteRepositoryImpl(QuoteJpaRepository jpaRepository, QuoteMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }

    @Override
    public Quote save(Quote quote) {
        // Map từ Domain sang DB Entity
        QuoteDbEntity dbEntity = mapper.toDbEntity(quote);

        // Gán ngược lại cha cho từng thằng con (để lấy quote_id)
        if (dbEntity.getDetails() != null) {
            dbEntity.getDetails().forEach(detail -> detail.setQuote(dbEntity));
        }

        QuoteDbEntity saved = jpaRepository.save(dbEntity);
        return mapper.toDomain(saved);
    }

    // BỔ SUNG: Triển khai hàm findById để hết lỗi abstract
    @Override
    public Optional<Quote> findById(int id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public Page<Quote> findAll(Pageable pageable) {
        // dùng hàm .map() của Page để chuyển từng Entity sang Domain
        return jpaRepository.findAll(pageable)
                .map(mapper::toDomain);
    }
    @Override
    public void deleteById(Integer id) {
        // Sửa quoteJpaRepository thành jpaRepository cho khớp với khai báo phía trên
        jpaRepository.deleteById(id);
    }
    @Override
    public Page<Quote> findByQuoteNumberContainingIgnoreCase(String keyword, Pageable pageable) {
        // Gọi xuống JpaRepository và map kết quả từ Entity sang Domain
        return jpaRepository.findByQuoteNumberContainingIgnoreCase(keyword, pageable)
                .map(mapper::toDomain);
    }

    @Override
    public Page<Quote> searchQuotes(String keyword, org.example.crm_be.module.QLBG.domain.entity.QuoteStatus status, java.math.BigDecimal minTotal, java.math.BigDecimal maxTotal, java.time.LocalDate startDate, java.time.LocalDate endDate, Pageable pageable) {
        return jpaRepository.searchQuotes(keyword, status, minTotal, maxTotal, startDate, endDate, pageable)
                .map(mapper::toDomain);
    }
}
