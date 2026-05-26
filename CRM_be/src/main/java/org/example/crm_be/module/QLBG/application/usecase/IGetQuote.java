package org.example.crm_be.module.QLBG.application.usecase;

import org.example.crm_be.module.QLBG.domain.entity.Quote;

public interface IGetQuote {
    Quote execute(int id);
}
