package org.example.crm_be.module.user.application.usecase;

import org.example.crm_be.module.user.application.dto.input.UserRequest;
import org.example.crm_be.module.user.application.dto.output.UserResponse;

public interface ICreateUser {
    UserResponse execute(UserRequest request);
}
