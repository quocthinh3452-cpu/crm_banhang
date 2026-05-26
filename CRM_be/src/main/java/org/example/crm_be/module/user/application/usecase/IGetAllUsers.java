package org.example.crm_be.module.user.application.usecase;

import org.example.crm_be.module.user.application.dto.output.UserResponse;

import java.util.List;

public interface IGetAllUsers {
    List<UserResponse> execute();
}
