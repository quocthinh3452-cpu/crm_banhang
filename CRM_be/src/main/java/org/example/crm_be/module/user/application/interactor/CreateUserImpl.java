package org.example.crm_be.module.user.application.interactor;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.user.application.dto.input.UserRequest;
import org.example.crm_be.module.user.application.dto.output.UserResponse;
import org.example.crm_be.module.user.application.mapper.UserMapper;
import org.example.crm_be.module.user.application.usecase.ICreateUser;
import org.example.crm_be.module.user.domain.entity.User;
import org.example.crm_be.module.user.domain.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CreateUserImpl implements ICreateUser {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public UserResponse execute(UserRequest request) {
        // Kiểm tra xem email đã tồn tại hay chưa
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail().trim());
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            if (!user.isSoftDeleted()) {
                throw new IllegalArgumentException("Email '" + request.getEmail() + "' đã tồn tại trên hệ thống. Vui lòng sử dụng email khác.");
            } else {
                // Nếu tài khoản cũ đã bị xóa mềm, ta có thể "khôi phục" nó
                user.setName(request.getName());
                // Nếu có nhập mật khẩu thì cập nhật băm
                if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
                    user.setPassword(passwordEncoder.encode(request.getPassword().trim()));
                }
                user.setRole(request.getRole());
                user.setPermissions(request.getPermissions());
                user.initializeForCreation(); // Đổi isActive=1, isDeleted=0, cập nhật ngày tạo mới
                User saved = userRepository.save(user);
                return userMapper.toResponse(saved);
            }
        }

        // Tạo người dùng mới hoàn toàn
        User user = userMapper.toDomain(request);
        user.initializeForCreation();

        // Băm mật khẩu (mật khẩu mặc định nếu trống là "123456")
        String rawPassword = (request.getPassword() != null && !request.getPassword().trim().isEmpty()) 
                ? request.getPassword().trim() 
                : "123456";
        user.setPassword(passwordEncoder.encode(rawPassword));

        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }
}
