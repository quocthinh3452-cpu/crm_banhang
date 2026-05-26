package org.example.crm_be.module.user.application.interactor;

import lombok.RequiredArgsConstructor;
import org.example.crm_be.module.user.application.usecase.IDeleteUser;
import org.example.crm_be.module.user.domain.entity.User;
import org.example.crm_be.module.user.domain.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteUserImpl implements IDeleteUser {

    private final UserRepository userRepository;

    @Override
    public void execute(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với ID: " + id));

        // Thực hiện xóa mềm
        user.markAsDeleted();
        userRepository.save(user);
    }
}
