package org.example.crm_be.common.persistence;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity(name = "CommonUserDbEntity")
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UserDbEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(length = 20)
    private String role;

    @Column(name = "is_active")
    private int isActive = 1;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
