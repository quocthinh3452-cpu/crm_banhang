package org.example.crm_be.module.user.application.interactor;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.user.application.dto.input.LoginRequest;
import org.example.crm_be.module.user.application.dto.output.UserResponse;
import org.example.crm_be.module.user.application.mapper.UserMapper;
import org.example.crm_be.module.user.application.usecase.ILoginUser;
import org.example.crm_be.module.user.domain.entity.User;
import org.example.crm_be.module.user.domain.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginUserImpl implements ILoginUser {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public UserResponse execute(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim())
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản email không tồn tại trong hệ thống."));

        if (user.isSoftDeleted()) {
            throw new IllegalArgumentException("Tài khoản này đã bị xóa khỏi hệ thống.");
        }

        if (!user.isUserActive()) {
            throw new IllegalArgumentException("Tài khoản này hiện đang bị khóa. Vui lòng liên hệ quản trị viên.");
        }

        // So khớp mật khẩu băm BCrypt
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu không chính xác, vui lòng thử lại.");
        }

        return userMapper.toResponse(user);
    }
}
