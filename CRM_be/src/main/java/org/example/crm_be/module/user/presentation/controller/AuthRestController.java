package org.example.crm_be.module.user.presentation.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.user.application.dto.input.LoginRequest;
import org.example.crm_be.module.user.application.dto.output.UserResponse;
import org.example.crm_be.module.user.application.usecase.ILoginUser;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthRestController {

    private final ILoginUser loginUser;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            UserResponse response = loginUser.execute(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Có lỗi hệ thống xảy ra khi đăng nhập.");
        }
    }
}
