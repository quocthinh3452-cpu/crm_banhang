package org.example.crm_be.module.QLBG.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing // Kích hoạt tự động điền created_at và updated_at
public class JpaAuditingConfig {
}
