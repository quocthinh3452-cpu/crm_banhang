package org.example.crm_be.module.user.application.interactor;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.user.application.dto.input.UserRequest;
import org.example.crm_be.module.user.application.dto.output.UserResponse;
import org.example.crm_be.module.user.application.mapper.UserMapper;
import org.example.crm_be.module.user.application.usecase.IUpdateUser;
import org.example.crm_be.module.user.domain.entity.User;
import org.example.crm_be.module.user.domain.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateUserImpl implements IUpdateUser {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public UserResponse execute(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với ID: " + id));

        if (user.isSoftDeleted()) {
            throw new IllegalArgumentException("Người dùng này đã bị xóa.");
        }

        // Kiểm tra xem email cập nhật có bị trùng với tài khoản khác không
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail().trim());
        if (existingUser.isPresent() && !existingUser.get().getId().equals(id)) {
            User other = existingUser.get();
            if (!other.isSoftDeleted()) {
                throw new IllegalArgumentException("Email '" + request.getEmail() + "' đã được sử dụng bởi người dùng khác.");
            }
        }

        // Cập nhật các thông tin cơ bản
        userMapper.updateDomainFromRequest(request, user);

        // Nếu có truyền mật khẩu mới, tiến hành mã hóa và cập nhật
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        }

        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }
}
