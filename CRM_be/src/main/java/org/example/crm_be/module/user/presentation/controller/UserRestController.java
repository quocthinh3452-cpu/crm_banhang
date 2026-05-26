package org.example.crm_be.module.user.presentation.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.user.application.dto.input.UserRequest;
import org.example.crm_be.module.user.application.dto.output.UserResponse;
import org.example.crm_be.module.user.application.usecase.ICreateUser;
import org.example.crm_be.module.user.application.usecase.IDeleteUser;
import org.example.crm_be.module.user.application.usecase.IGetAllUsers;
import org.example.crm_be.module.user.application.usecase.IUpdateUser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserRestController {

    private final IGetAllUsers getAllUsers;
    private final ICreateUser createUser;
    private final IUpdateUser updateUser;
    private final IDeleteUser deleteUser;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getUsers() {
        return ResponseEntity.ok(getAllUsers.execute());
    }

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody UserRequest request) {
        try {
            UserResponse response = createUser.execute(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Có lỗi xảy ra khi tạo tài khoản mới.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody UserRequest request) {
        try {
            UserResponse response = updateUser.execute(id, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Có lỗi xảy ra khi cập nhật tài khoản.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            deleteUser.execute(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
