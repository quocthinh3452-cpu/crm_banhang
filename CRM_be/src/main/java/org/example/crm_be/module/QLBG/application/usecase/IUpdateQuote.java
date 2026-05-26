package org.example.crm_be.module.QLBG.application.usecase;

import org.example.crm_be.module.QLBG.application.dto.input.QuoteRequest;
import org.example.crm_be.module.QLBG.application.dto.output.QuoteResponse;

public interface IUpdateQuote {
    QuoteResponse execute(Integer id, QuoteRequest request);
}
