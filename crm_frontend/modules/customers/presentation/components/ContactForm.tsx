'use client';

import React from 'react';

import { useForm } from 'react-hook-form';

import {
  Contact,
  CreateContactInput,
  ContactRole,
} from '@/modules/customers/domain/types';

interface Props {
  customerId: string | number;

  contact?: Contact;

  onSubmit: (
    data: CreateContactInput
  ) => Promise<void>;

  onCancel: () => void;

  loading?: boolean;
}

const roles: ContactRole[] = [
  'Giám đốc',
  'Kế toán',
  'Nhân viên mua hàng',
  'Nhân viên kỹ thuật',
  'Khác',
];

export default function ContactForm({
  customerId,
  contact,
  onSubmit,
  onCancel,
  loading = false,
}: Props) {
  const isEditMode = !!contact;

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      isSubmitting,
    },
  } = useForm<CreateContactInput>({
    defaultValues: contact
      ? {
          customerId,

          fullName:
            contact.fullName,

          email:
            contact.email,

          phone:
            contact.phone,

          role:
            contact.role,

          department:
            contact.department,

          note:
            contact.note,

          isPrimary:
            contact.isPrimary,
        }
      : {
          customerId,

          fullName: '',

          email: '',

          phone: '',

          role: 'Khác',

          department: '',

          note: '',

          isPrimary: false,
        },
  });

  const handleFormSubmit =
    async (
      data: CreateContactInput
    ) => {
      try {
        await onSubmit(data);

        reset();
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <form
      onSubmit={handleSubmit(
        handleFormSubmit
      )}
      className="space-y-4"
    >
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Họ tên *
        </label>

        <input
          type="text"
          {...register(
            'fullName'
          )}
          placeholder="Nhập họ tên"
          disabled={
            isSubmitting ||
            loading
          }
          className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Email
        </label>

        <input
          type="email"
          {...register('email')}
          placeholder="contact@gmail.com"
          disabled={
            isSubmitting ||
            loading
          }
          className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Điện thoại
        </label>

        <input
          type="text"
          {...register('phone')}
          placeholder="0912345678"
          disabled={
            isSubmitting ||
            loading
          }
          className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Vai trò
        </label>

        <select
          {...register('role')}
          className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white"
        >
          {roles.map(
            (role) => (
              <option
                key={role}
                value={role}
              >
                {role}
              </option>
            )
          )}
        </select>
      </div>

      {/* Department */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Phòng ban
        </label>

        <input
          type="text"
          {...register(
            'department'
          )}
          placeholder="Kinh doanh"
          className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white"
        />
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Ghi chú
        </label>

        <textarea
          rows={3}
          {...register('note')}
          className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white"
        />
      </div>

      {/* Primary */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register(
            'isPrimary'
          )}
        />

        <label className="text-sm text-slate-300">
          Người liên hệ chính
        </label>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white"
        >
          Hủy
        </button>

        <button
          type="submit"
          disabled={
            isSubmitting ||
            loading
          }
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isEditMode
            ? 'Cập nhật'
            : 'Thêm liên hệ'}
        </button>
      </div>
    </form>
  );
}