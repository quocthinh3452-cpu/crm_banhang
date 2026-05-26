package org.example.crm_be.module.user.application.interactor;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.user.application.dto.output.UserResponse;
import org.example.crm_be.module.user.application.mapper.UserMapper;
import org.example.crm_be.module.user.application.usecase.IGetAllUsers;
import org.example.crm_be.module.user.domain.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetAllUsersImpl implements IGetAllUsers {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public List<UserResponse> execute() {
        return userRepository.findAll().stream()
                .filter(user -> !user.isSoftDeleted()) // Lọc bỏ các tài khoản đã xóa mềm
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }
}
