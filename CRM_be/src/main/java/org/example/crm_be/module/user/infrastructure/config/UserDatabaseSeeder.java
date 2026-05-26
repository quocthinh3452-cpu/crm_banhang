package org.example.crm_be.module.user.infrastructure.config;

import org.example.crm_be.module.user.domain.entity.User;
import org.example.crm_be.module.user.domain.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//@Configuration // Uncommented so it runs automatically to sync with DB!
@Configuration
public class UserDatabaseSeeder {

    @Bean
    public CommandLineRunner seedUsers(UserRepository userRepository) {
        return args -> {
            if (userRepository.findAll().isEmpty()) {
                System.out.println("Đang nạp tài khoản người dùng mặc định...");

                // BCrypt băm sẵn của "password" là: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro911C/.og/at2.uheWG/igi
                String defaultHashedPassword = "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro911C/.og/at2.uheWG/igi";

                // 1. Tài khoản Admin
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@crm.local");
                admin.setPassword(defaultHashedPassword);
                admin.setRole("admin");
                admin.setPermissions(""); // Admin không cần permissions cụ thể vì Admin chỉ được truy cập user management
                admin.initializeForCreation();
                userRepository.save(admin);

                // 2. Tài khoản Thành viên 1
                User member1 = new User();
                member1.setName("Thành Viên 1");
                member1.setEmail("member1@crm.loc");
                member1.setPassword(defaultHashedPassword);
                member1.setRole("sales");
                member1.setPermissions("PRODUCTS_VIEW,DOCUMENTS_VIEW"); // Mặc định được xem Sản phẩm và Tài liệu
                member1.initializeForCreation();
                userRepository.save(member1);

                // 3. Tài khoản Thành viên 2
                User member2 = new User();
                member2.setName("Thành Viên 2");
                member2.setEmail("member2@crm.loc");
                member2.setPassword(defaultHashedPassword);
                member2.setRole("sales");
                member2.setPermissions("PRODUCTS_VIEW,PRODUCTS_MANAGE"); // Mặc định được quản lý Sản phẩm
                member2.initializeForCreation();
                userRepository.save(member2);

                // 4. Tài khoản Thành viên 3
                User member3 = new User();
                member3.setName("Thành Viên 3");
                member3.setEmail("member3@crm.loc");
                member3.setPassword(defaultHashedPassword);
                member3.setRole("manager");
                // Được toàn quyền các module khác trừ admin
                member3.setPermissions("PRODUCTS_VIEW,PRODUCTS_MANAGE,PRODUCT_TYPES_VIEW,PRODUCT_TYPES_MANAGE,DOCUMENTS_VIEW,DOCUMENTS_MANAGE");
                member3.initializeForCreation();
                userRepository.save(member3);

                System.out.println("Nạp tài khoản người dùng mặc định thành công!");
            }
        };
    }
}
