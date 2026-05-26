package org.example.crm_be.module.user.application.usecase;

import org.example.crm_be.module.user.application.dto.input.LoginRequest;
import org.example.crm_be.module.user.application.dto.output.UserResponse;

public interface ILoginUser {
    UserResponse execute(LoginRequest request);
}
