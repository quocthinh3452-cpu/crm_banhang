package org.example.crm_be.common.controller;

import org.example.crm_be.common.persistence.UserDbEntity;
import org.example.crm_be.common.persistence.UserJpaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserJpaRepository userJpaRepository;

    public UserController(UserJpaRepository userJpaRepository) {
        this.userJpaRepository = userJpaRepository;
    }

    @GetMapping
    public List<UserDbEntity> getAllUsers() {
        return userJpaRepository.findAll();
    }
}
