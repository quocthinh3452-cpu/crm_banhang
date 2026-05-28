// app/crm/users/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { TextInput } from '@/shared/components/form/TextInput';
import { SelectBox } from '@/shared/components/form/SelectBox';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { userApi } from '@/modules/user/api/user.api';
import { User } from '@/modules/user/types/user.type';
import { ShieldCheck, ShieldAlert, KeyRound, UserMinus } from 'lucide-react';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';

// Định nghĩa danh sách các quyền nghiệp vụ để tích chọn
const SYSTEM_PERMISSIONS = [
  { code: 'PRODUCTS_VIEW', label: 'Xem sản phẩm' },
  { code: 'PRODUCTS_MANAGE', label: 'Thêm/Sửa/Xóa sản phẩm' },
  { code: 'PRODUCT_TYPES_VIEW', label: 'Xem loại sản phẩm' },
  { code: 'PRODUCT_TYPES_MANAGE', label: 'Thêm/Sửa/Xóa loại sản phẩm' },
  { code: 'DOCUMENTS_VIEW', label: 'Xem tài liệu' },
  { code: 'DOCUMENTS_MANAGE', label: 'Thêm/Sửa/Xóa tài liệu' },
  { code: 'CUSTOMERS_VIEW', label: 'Xem khách hàng' },
  { code: 'CUSTOMERS_MANAGE', label: 'Thêm/Sửa/Xóa khách hàng' },
  { code: 'LEADS_VIEW', label: 'Xem Leads' },
  { code: 'LEADS_MANAGE', label: 'Thêm/Sửa/Xóa Leads' },
  { code: 'QUOTES_VIEW', label: 'Xem Báo giá' },
  { code: 'QUOTES_MANAGE', label: 'Thêm/Sửa/Xóa Báo giá' },
  { code: 'CONTRACTS_VIEW', label: 'Xem Hợp đồng' },
  { code: 'CONTRACTS_MANAGE', label: 'Thêm/Sửa/Xóa Hợp đồng' },
];

// Zod Schema cho user validation
const userSchema = z.object({
  name: z.string().min(2, 'Tên người dùng phải từ 2 ký tự').max(100, 'Tên không quá 100 ký tự'),
  email: z.string().min(1, 'Email không được để trống').email('Email không đúng định dạng'),
  password: z.string().optional().or(z.literal('')),
  role: z.string().min(1, 'Vui lòng chọn vai trò'),
  isActive: z.coerce.number().min(0).max(1),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Lưu thông tin người dùng đang đăng nhập
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  // States quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // State Confirm Dialog Xóa
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTargetUser, setDeleteTargetUser] = useState<User | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // State quản lý các checkbox quyền được chọn
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors }, reset, setError, watch } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema) as any,
  });

  const selectedRole = watch('role');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userApi.getAll();
      setUsers(data || []);
    } catch (e) {
      console.error(e);
      toast.error('Không thể tải danh sách tài khoản người dùng.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    // Lấy thông tin user đăng nhập
    const session = localStorage.getItem('crm_user_session');
    if (session) {
      try {
        setLoggedInUser(JSON.parse(session));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setSelectedPermissions([]);
    reset({
      name: '',
      email: '',
      password: '',
      role: 'sales',
      isActive: 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    // Tách chuỗi quyền thành mảng
    const perms = user.permissions ? user.permissions.split(',') : [];
    setSelectedPermissions(perms);
    reset({
      name: user.name,
      email: user.email,
      password: '', // Không hiện mật khẩu cũ vì lý do bảo mật
      role: user.role,
      isActive: user.isActive,
    });
    setIsModalOpen(true);
  };

  const handlePermissionChange = (code: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions((prev) => [...prev, code]);
    } else {
      setSelectedPermissions((prev) => prev.filter((item) => item !== code));
    }
  };

  const onSubmit = async (data: UserFormValues) => {
    setIsSaving(true);
    try {
      // Chuẩn hóa password
      const userRequest = {
        name: data.name.trim(),
        email: data.email.trim(),
        role: data.role,
        isActive: data.isActive,
        permissions: selectedPermissions.join(','), // Gộp mảng thành chuỗi phân tách bằng dấu phẩy
        ...(data.password && data.password.trim() ? { password: data.password.trim() } : {}),
      };

      if (editingUser) {
        await userApi.update(editingUser.id, userRequest);
        toast.success('Cập nhật tài khoản thành công!');
      } else {
        // Tạo mới nếu chưa có password mặc định là '123456'
        if (!data.password || !data.password.trim()) {
          userRequest.password = '123456';
        }
        await userApi.create(userRequest);
        toast.success('Tạo tài khoản mới thành công!');
      }
      
      setIsModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      const backendError = error.response?.data;
      const msg = typeof backendError === 'string' ? backendError : 'Có lỗi xảy ra khi lưu dữ liệu.';
      
      if (msg.toLowerCase().includes('email') && msg.toLowerCase().includes('tồn tại')) {
        setError('email', {
          type: 'manual',
          message: 'Email đã tồn tại, vui lòng chọn email khác.',
        });
      } else {
        toast.error(msg);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (user: User) => {
    // Ngăn chặn admin tự xóa chính mình
    if (loggedInUser && loggedInUser.email === user.email) {
      toast.error('Bạn không được phép xóa tài khoản Admin đang đăng nhập!');
      return;
    }

    setDeleteTargetUser(user);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetUser) return;
    setConfirmLoading(true);
    try {
      await userApi.delete(deleteTargetUser.id);
      toast.success('Xóa tài khoản thành công!');
      fetchUsers();
    } catch (e) {
      toast.error('Không thể xóa người dùng này.');
    } finally {
      setConfirmLoading(false);
      setIsConfirmOpen(false);
      setDeleteTargetUser(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Tài khoản & Phân quyền</h1>
          <p className="text-sm text-gray-500">
            Quản trị viên cấu hình tài khoản người dùng, băm bảo mật mật khẩu và phân quyền hạn nghiệp vụ cho thành viên.
          </p>
        </div>
        <Button onClick={handleOpenAdd}>
          + Thêm người dùng
        </Button>
      </div>

      {/* Danh sách người dùng */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600 w-20">ID</th>
                <th className="p-4 font-semibold text-gray-600">Tên người dùng</th>
                <th className="p-4 font-semibold text-gray-600">Email đăng nhập</th>
                <th className="p-4 font-semibold text-gray-600 w-32">Vai trò</th>
                <th className="p-4 font-semibold text-gray-600 w-44">Quyền hạn cấp</th>
                <th className="p-4 font-semibold text-gray-600 w-36">Trạng thái</th>
                <th className="p-4 font-semibold text-gray-600 text-center w-48">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="border-b">
                    <td className="p-4"><Skeleton className="h-4 w-8" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-48" /></td>
                    <td className="p-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-40" /></td>
                    <td className="p-4"><Skeleton className="h-6 w-24 rounded-full" /></td>
                    <td className="p-4"><Skeleton className="h-8 w-24 mx-auto rounded" /></td>
                  </tr>
                ))
              ) : users.length > 0 ? (
                users.map((item) => {
                  const isSelf = loggedInUser?.email === item.email;
                  const permsList = item.permissions ? item.permissions.split(',') : [];
                  
                  return (
                    <tr key={item.id} className={`border-b hover:bg-gray-50 transition-colors ${isSelf ? 'bg-blue-50/20' : ''}`}>
                      <td className="p-4 font-mono text-sm text-gray-500">#{item.id}</td>
                      <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                        {item.name}
                        {isSelf && (
                          <span className="px-2 py-0.5 text-[10px] bg-blue-100 text-blue-700 font-semibold rounded">
                            Bạn
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-gray-600">{item.email}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          item.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                            : item.role === 'manager'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}>
                          {item.role === 'admin' ? 'Quản trị viên' : item.role === 'manager' ? 'Trưởng phòng' : 'Nhân viên'}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-gray-600 max-w-[250px]">
                        {item.role === 'admin' ? (
                          <span className="text-gray-400 italic">Mặc định toàn quyền Quản trị</span>
                        ) : permsList.length > 0 && permsList[0] !== '' ? (
                          <div className="flex flex-wrap gap-1">
                            {permsList.map((p) => (
                              <span key={p} className="px-1.5 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-md text-[10px] font-medium">
                                {SYSTEM_PERMISSIONS.find((sp) => sp.code === p)?.label || p}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-red-400 italic">Chưa cấp quyền</span>
                        )}
                      </td>
                      <td className="p-4">
                        {item.isActive === 1 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-full">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                            Đang hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-red-50 text-red-700 border border-red-200 rounded-full">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                            Đang bị khóa
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <Button variant="outline" className="text-xs px-3 h-8" onClick={() => handleOpenEdit(item)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              <path d="m15 5 4 4" />
                            </svg>
                          </Button>
                          <Button
                            variant="outline"
                            className={`text-xs px-3 h-8 text-red-600 hover:bg-red-50 hover:border-red-200 ${isSelf ? 'opacity-40 cursor-not-allowed' : ''}`}
                            disabled={isSelf}
                            onClick={() => handleDelete(item)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              <line x1="10" x2="10" y1="11" y2="17" />
                              <line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-500">
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Thêm/Sửa Người dùng */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Chỉnh sửa người dùng & Phân quyền" : "Tạo tài khoản người dùng mới"}
        size="5xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1">
            <TextInput
              label="Họ và tên"
              placeholder="VD: Nguyễn Văn A"
              {...register('name')}
              error={errors.name?.message}
              containerClassName="mb-1"
            />

            <TextInput
              label="Email đăng nhập"
              placeholder="VD: user@company.com"
              {...register('email')}
              error={errors.email?.message}
              disabled={!!editingUser} // Không cho phép đổi Email đối với tài khoản cũ để tránh lỗi dữ liệu
              containerClassName="mb-1"
            />

            <TextInput
              label={editingUser ? "Mật khẩu mới (Để trống nếu không đổi)" : "Mật khẩu (Mặc định: 123456)"}
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
              containerClassName="mb-1"
            />

            <SelectBox
              label="Vai trò"
              options={[
                { label: 'Nhân viên (sales/member)', value: 'sales' },
                { label: 'Trưởng phòng (manager)', value: 'manager' },
                { label: 'Quản trị viên (admin)', value: 'admin' },
              ]}
              {...register('role')}
              error={errors.role?.message}
              disabled={editingUser?.email === loggedInUser?.email} // Không tự sửa vai trò của mình để tránh mất quyền quản trị
              containerClassName="mb-1"
            />

            {editingUser && (
              <SelectBox
                label="Trạng thái tài khoản"
                options={[
                  { label: 'Đang hoạt động', value: '1' },
                  { label: 'Khóa tài khoản', value: '0' },
                ]}
                {...register('isActive')}
                error={errors.isActive?.message}
                disabled={editingUser.email === loggedInUser?.email} // Không tự khóa chính mình
                containerClassName="mb-1"
              />
            )}
          </div>

          {/* Khu vực phân quyền chi tiết (Chỉ hiển thị nếu vai trò không phải Admin) */}
          {selectedRole !== 'admin' && (
            <div className="border-t border-gray-150 pt-3">
              <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-blue-600" />
                Cấp quyền hạn nghiệp vụ cho thành viên
              </h4>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <label className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Danh sách quyền hạn chi tiết
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {SYSTEM_PERMISSIONS.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm.code);
                    
                    return (
                      <label 
                        key={perm.code} 
                        className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer select-none transition-all ${
                          isChecked 
                            ? 'bg-blue-50/50 border-blue-200 text-blue-900 shadow-sm' 
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handlePermissionChange(perm.code, e.target.checked)}
                          className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="text-[11px] font-medium leading-tight">{perm.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Các nút điều hướng form */}
          <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Hủy bỏ
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Đang xử lý...' : (editingUser ? 'Lưu thay đổi' : 'Lưu tài khoản')}
            </Button>
          </div>

        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Xác nhận xóa tài khoản"
        message={`Bạn có chắc chắn muốn xóa (xóa mềm) tài khoản '${deleteTargetUser?.name}' không?`}
        itemName={deleteTargetUser?.name}
        onCancel={() => {
          setIsConfirmOpen(false);
          setDeleteTargetUser(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={confirmLoading}
        confirmText="Xác nhận xóa"
      />
    </div>
  );
}
