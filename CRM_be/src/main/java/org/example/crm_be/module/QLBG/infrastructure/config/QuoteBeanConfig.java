package org.example.crm_be.module.QLBG.infrastructure.config;

import org.example.crm_be.module.QLBG.application.usecase.IDeleteQuote;
import org.example.crm_be.module.QLBG.application.usecase.IUpdateQuote;
import org.example.crm_be.module.QLBG.application.interactor.CreateQuoteImpl;
import org.example.crm_be.module.QLBG.application.interactor.DeleteQuoteImpl;
import org.example.crm_be.module.QLBG.application.interactor.GetAllQuotesImpl;
import org.example.crm_be.module.QLBG.application.usecase.ICreateQuote;
import org.example.crm_be.module.QLBG.application.usecase.IGetAllQuotes;
import org.example.crm_be.module.QLBG.application.interactor.UpdateQuoteImpl;
import org.example.crm_be.module.QLBG.application.mapper.QuoteMapper;
import org.example.crm_be.module.QLBG.domain.repository.QuoteRepository;
import org.example.crm_be.common.persistence.ProductJpaRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QuoteBeanConfig {

    @Bean
    public ICreateQuote createQuoteUseCase(QuoteRepository quoteRepository, QuoteMapper quoteMapper, ProductJpaRepository productJpaRepository) {
        return new CreateQuoteImpl(quoteRepository, quoteMapper, productJpaRepository);
    }

    @Bean
    public IGetAllQuotes getAllQuotesUseCase(QuoteRepository quoteRepository, QuoteMapper quoteMapper) {
        return new GetAllQuotesImpl(quoteRepository, quoteMapper);
    }

    @Bean
    public IDeleteQuote deleteQuoteUseCase(QuoteRepository quoteRepository) {
        // Đăng ký Use Case xóa vào hệ thống
        return new DeleteQuoteImpl(quoteRepository);
    }

    @Bean
    public IUpdateQuote updateQuoteUseCase(QuoteRepository quoteRepository, QuoteMapper quoteMapper) {
        return new UpdateQuoteImpl(quoteRepository, quoteMapper);
    }
}
