'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/components/ui/Button';
import { TextInput } from '@/shared/components/form/TextInput';
import { SelectBox } from '@/shared/components/form/SelectBox';
import {
  CUSTOMER_TYPES,
  CUSTOMER_TIERS,
  CUSTOMER_STATUSES,
} from '@/modules/customers/domain/constants';
import { CreateCustomerInput } from '@/modules/customers/domain/types';

type CustomerFormData = CreateCustomerInput;

interface Props {
  customer?: Partial<CustomerFormData>;
  onSubmit: (
    data: CustomerFormData
  ) => Promise<void>;

  onCancel: () => void;

  loading?: boolean;
  hideActions?: boolean;
  submitId?: string;
  submitRef?:
    | React.RefObject<HTMLButtonElement | null>
    | null;
}

export default function CustomerForm({
  customer,
  onSubmit,
  onCancel,
  loading = false,
  hideActions = false,
  submitId,
  submitRef = null,
}: Props) {
  const isEditMode = !!customer;

  const inputClass =
    'w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      isSubmitting,
      errors,
    },
  } = useForm<CustomerFormData>({
    mode: 'onTouched',
    defaultValues: {
      name: customer?.name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      type: customer?.type || 'B2B',
      tier: customer?.tier || 'Bạc',
      status: customer?.status || 'Đang chăm sóc',
      budget: customer?.budget ?? undefined,
      notes: customer?.notes || '',
    },
  });

  useEffect(() => {
    reset({
      name: customer?.name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      type: customer?.type || 'B2B',
      tier: customer?.tier || 'Bạc',
      status: customer?.status || 'Đang chăm sóc',
      budget: customer?.budget ?? undefined,
      notes: customer?.notes || '',
    });
  }, [customer, reset]);

  const handleEnterKey = (
    event:
      | React.KeyboardEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
  ) => {
    if (event.key !== 'Enter') {
      return;
    }

    const form = event.currentTarget.form;
    if (!form) {
      return;
    }

    event.preventDefault();

    const focusable = Array.from(
      form.elements
    ).filter(
      (element): element is
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLTextAreaElement =>
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement
    );

    const activeIndex = focusable.findIndex(
      (field) => field === event.currentTarget
    );

    const nextField =
      focusable[activeIndex + 1];

    if (nextField) {
      nextField.focus();
      return;
    }

    form.requestSubmit?.();
  };

  const handleFormSubmit =
    async (
      data: CustomerFormData
    ) => {
      try {
        await onSubmit(data);

        reset();
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

  const handleFormKeyDown = (
    event: React.KeyboardEvent<HTMLFormElement>
  ) => {
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key === 'Enter'
    ) {
      event.preventDefault();
      void handleSubmit(handleFormSubmit)();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(
        handleFormSubmit
      )}
      onKeyDown={handleFormKeyDown}
      className="space-y-4 bg-white p-2 rounded-xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
        {/* Name */}
        <div className="md:col-span-2">
          <TextInput
            label="Tên khách hàng"
            required
            placeholder="Nhập tên khách hàng"
            autoFocus
            {...register('name', {
              required: 'Tên khách hàng là bắt buộc',
            })}
            disabled={isSubmitting || loading}
            onKeyDown={handleEnterKey}
            error={errors.name?.message}
          />
        </div>

        {/* Email */}
        <div>
          <TextInput
            label="Email"
            required
            type="email"
            placeholder="abc@gmail.com"
            {...register('email', {
              required: 'Email là bắt buộc',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email không hợp lệ',
              },
            })}
            disabled={isSubmitting || loading}
            onKeyDown={handleEnterKey}
            error={errors.email?.message}
          />
        </div>

        {/* Phone */}
        <div>
          <TextInput
            label="Điện thoại"
            placeholder="0912345678"
            {...register('phone', {
              pattern: {
                value: /^[0-9+\s()-]*$/,
                message: 'Số điện thoại không hợp lệ',
              },
            })}
            disabled={isSubmitting || loading}
            onKeyDown={handleEnterKey}
            error={errors.phone?.message}
          />
        </div>

        {/* Type */}
        <div>
          <SelectBox
            label="Loại khách hàng"
            required
            options={CUSTOMER_TYPES.map(t => ({ label: t.label, value: t.value }))}
            {...register('type')}
            disabled={isSubmitting || loading}
            onKeyDown={handleEnterKey}
            error={errors.type?.message}
          />
        </div>

        {/* Tier */}
        <div>
          <SelectBox
            label="Hạng khách hàng"
            required
            options={CUSTOMER_TIERS.map(t => ({ label: t.label, value: t.value }))}
            {...register('tier')}
            disabled={isSubmitting || loading}
            onKeyDown={handleEnterKey}
            error={errors.tier?.message}
          />
        </div>

        {/* Status */}
        <div>
          <SelectBox
            label="Trạng thái"
            required
            options={CUSTOMER_STATUSES.map(s => ({ label: s.label, value: s.value }))}
            {...register('status')}
            disabled={isSubmitting || loading}
            onKeyDown={handleEnterKey}
            error={errors.status?.message}
          />
        </div>

        {/* Budget */}
        <div>
          <TextInput
            label="Ngân sách (VND)"
            type="number"
            placeholder="0"
            {...register('budget', {
              valueAsNumber: true,
              min: {
                value: 0,
                message: 'Ngân sách không được âm',
              },
            })}
            disabled={isSubmitting || loading}
            onKeyDown={handleEnterKey}
            error={errors.budget?.message}
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-2 mb-4">
          <label htmlFor="notes" className="mb-1 text-sm font-semibold text-gray-750 block">
            Ghi chú
          </label>
          <textarea
            id="notes"
            rows={3}
            placeholder="Ghi chú thêm về khách hàng..."
            {...register('notes')}
            onKeyDown={handleEnterKey}
            disabled={isSubmitting || loading}
            className="w-full px-4 py-2.5 border rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all bg-white text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      {!hideActions ? (
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onCancel}
            title="Esc"
          >
            Hủy <span className="text-xs opacity-75 ml-1">(Esc)</span>
          </Button>

          <Button
            id={submitId}
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting || loading}
            title="Enter"
          >
            {isEditMode
              ? 'Cập nhật'
              : 'Thêm khách hàng'} <span className="text-xs opacity-75 ml-1">(Enter)</span>
          </Button>
        </div>
      ) : (
        <button
          type="submit"
          id={submitId}
          ref={submitRef}
          className="sr-only"
          disabled={isSubmitting || loading}
          aria-hidden="true"
        />
      )}
    </form>
  );
}