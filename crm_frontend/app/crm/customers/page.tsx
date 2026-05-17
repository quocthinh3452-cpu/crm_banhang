'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { TextInput } from '@/shared/components/form/TextInput';
import { SelectBox } from '@/shared/components/form/SelectBox';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { Pagination } from '@/shared/components/ui/Pagination';
import { formatCurrency, formatDateTime } from '@/shared/utils/formatters';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// 1. Định nghĩa Schema Validation bằng Zod
const customerSchema = z.object({
  name: z.string().min(2, 'Tên khách hàng phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  type: z.string().min(1, 'Vui lòng chọn nhóm khách hàng'),
  budget: z.coerce.number().min(1000, 'Ngân sách tối thiểu là 1,000đ'),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function CustomerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);

  // 2. Setup React Hook Form
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(customerSchema),
  });

  // Giả lập fetch dữ liệu khi vào trang
  useEffect(() => {
    const timer = setTimeout(() => {
      setCustomers([
        { id: 1, name: 'Nguyễn Văn A', email: 'vana@gmail.com', type: 'VIP', budget: 5000000, createdAt: new Date() },
        { id: 2, name: 'Trần Thị B', email: 'thib@gmail.com', type: 'Tiềm năng', budget: 1200000, createdAt: new Date() },
      ]);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = (data: CustomerFormValues) => {
    console.log('Dữ liệu form:', data);
    alert('Thêm khách hàng thành công! Kiểm tra console log.');
    setIsModalOpen(false);
    reset();
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Khách hàng</h1>
          <p className="text-sm text-gray-500">Theo dõi và quản lý thông tin khách hàng trong hệ thống CRM</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          + Thêm khách hàng
        </Button>
      </div>

      {/* Main Content: Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Khách hàng</th>
              <th className="p-4 font-semibold text-gray-600">Phân loại</th>
              <th className="p-4 font-semibold text-gray-600">Ngân sách dự kiến</th>
              <th className="p-4 font-semibold text-gray-600">Ngày tạo</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Sử dụng Skeleton khi đang tải
              [1, 2, 3].map((i) => (
                <tr key={i}>
                  <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="p-4"><Skeleton className="h-4 w-28" /></td>
                  <td className="p-4"><Skeleton className="h-8 w-16 mx-auto" /></td>
                </tr>
              ))
            ) : (
              customers.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">{item.type}</span>
                  </td>
                  <td className="p-4 text-green-600 font-medium">
                    {formatCurrency(item.budget)}
                  </td>
                  <td className="p-4 text-gray-500 text-sm">
                    {formatDateTime(item.createdAt)}
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="outline" className="text-xs py-1 h-8">Chi tiết</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination component */}
      {!isLoading && (
        <Pagination currentPage={1} totalPages={5} onPageChange={(p) => console.log('Chuyển trang:', p)} />
      )}

      {/* Modal Thêm mới sử dụng Form dùng chung */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Tạo khách hàng mới"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <TextInput 
            label="Họ và tên" 
            placeholder="Nhập tên khách hàng..." 
            {...register('name')}
            error={errors.name?.message}
          />
          
          <TextInput 
            label="Email" 
            type="email"
            placeholder="example@gmail.com" 
            {...register('email')}
            error={errors.email?.message}
          />

          <SelectBox 
            label="Nhóm khách hàng"
            options={[
              { label: 'Khách hàng VIP', value: 'VIP' },
              { label: 'Khách hàng Tiềm năng', value: 'Potent' },
              { label: 'Khách hàng Mới', value: 'New' },
            ]}
            {...register('type')}
            error={errors.type?.message}
          />

          <TextInput 
            label="Ngân sách (VND)" 
            type="number"
            {...register('budget')}
            error={errors.budget?.message}
          />

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">
              Lưu thông tin
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}