package org.example.crm_be.module.user.application.dto.input;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {

    @NotBlank(message = "Tên người dùng không được để trống")
    @Size(min = 2, max = 100, message = "Tên người dùng phải từ 2 đến 100 ký tự")
    private String name;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    // Cho phép để trống password khi UPDATE (nếu không sửa mật khẩu)
    private String password;

    @NotBlank(message = "Vai trò không được để trống")
    private String role;

    private String permissions; // Chuỗi quyền phân tách bằng dấu phẩy

    private Integer isActive; // 1: hoạt động, 0: khóa
}
