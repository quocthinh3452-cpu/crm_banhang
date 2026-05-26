'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/components/ui/Button';
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
    'w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';

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
      className="space-y-6"
    >
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Tên khách hàng *
        </label>

        <input
          type="text"
          placeholder="Nhập tên khách hàng"
          autoFocus
          {...register('name', {
            required: 'Tên khách hàng là bắt buộc',
          })}
          disabled={
            isSubmitting || loading
          }
          onKeyDown={handleEnterKey}
          className={inputClass}
        />
        {errors.name ? (
          <p className="mt-2 text-sm text-rose-400">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Email *
        </label>

        <input
          type="email"
          placeholder="abc@gmail.com"
          {...register('email', {
            required: 'Email là bắt buộc',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Email không hợp lệ',
            },
          })}
          disabled={
            isSubmitting || loading
          }
          onKeyDown={handleEnterKey}
          className={inputClass}
        />
        {errors.email ? (
          <p className="mt-2 text-sm text-rose-400">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Điện thoại
        </label>

        <input
          type="text"
          placeholder="0912345678"
          {...register('phone', {
            pattern: {
              value: /^[0-9+\s()-]*$/,
              message: 'Số điện thoại không hợp lệ',
            },
          })}
          disabled={
            isSubmitting || loading
          }
          onKeyDown={handleEnterKey}
          className={inputClass}
        />
        {errors.phone ? (
          <p className="mt-2 text-sm text-rose-400">
            {errors.phone.message}
          </p>
        ) : null}
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Loại khách hàng *
        </label>

        <select
          {...register('type')}
          onKeyDown={handleEnterKey}
          className={inputClass}
        >
          {CUSTOMER_TYPES.map(
            (type) => (
              <option
                key={type.value}
                value={type.value}
              >
                {type.label}
              </option>
            )
          )}
        </select>
      </div>

      {/* Tier */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Hạng khách hàng *
        </label>

        <select
          {...register('tier')}
          onKeyDown={handleEnterKey}
          className={inputClass}
        >
          {CUSTOMER_TIERS.map(
            (tier) => (
              <option
                key={tier.value}
                value={tier.value}
              >
                {tier.label}
              </option>
            )
          )}
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Trạng thái *
        </label>

        <select
          {...register('status')}
          onKeyDown={handleEnterKey}
          className={inputClass}
        >
          {CUSTOMER_STATUSES.map(
            (status) => (
              <option
                key={status.value}
                value={status.value}
              >
                {status.label}
              </option>
            )
          )}
        </select>
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Ngân sách
        </label>

        <input
          type="number"
          {...register('budget', {
            valueAsNumber: true,
            min: {
              value: 0,
              message: 'Ngân sách không được âm',
            },
          })}
          onKeyDown={handleEnterKey}
          className={inputClass}
        />
        {errors.budget ? (
          <p className="mt-2 text-sm text-rose-400">
            {errors.budget.message}
          </p>
        ) : null}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">
          Ghi chú
        </label>

        <textarea
          rows={5}
          {...register('notes')}
          onKeyDown={handleEnterKey}
          className={inputClass}
        />
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