'use client';

import React, { useEffect, useState } from 'react';
import { Diamond, Pencil, Shield, Star, Trash2, Users } from 'lucide-react';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { Loading } from '@/shared/components/ui/Loading';
import { formatCurrency } from '@/shared/utils/formatters';
import { Customer } from '@/modules/customers/domain/types';


interface Props {
  customers: Customer[];

  loading?: boolean;

  onEdit?: (
    customer: Customer
  ) => void;

  onDelete?: (
    id: string | number
  ) => void;

  onSelectionChange?: React.Dispatch<
    React.SetStateAction<
      (string | number)[]
    >
  >;
}

export default function CustomerTable({
  customers = [],
  loading,
  onEdit,
  onDelete,
  onSelectionChange,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<
    (string | number)[]
  >([]);

  const customerList = customers ?? [];
  const allSelected =
    customerList.length > 0 &&
    selectedIds.length ===
      customerList.length;

  useEffect(() => {
    onSelectionChange?.(selectedIds);
  }, [onSelectionChange, selectedIds]);

  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case 'Đang chăm sóc':
        return 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/20';

      case 'Ngừng':
        return 'bg-slate-700 text-slate-100 ring-1 ring-slate-600/50';

      case 'Blacklist':
        return 'bg-rose-500/15 text-rose-200 ring-1 ring-rose-500/20';

      default:
        return 'bg-slate-700 text-slate-100 ring-1 ring-slate-600/50';
    }
  };

  const getTypeColor = (
    type: string
  ) => {
    switch (type) {
      case 'B2B':
        return 'bg-sky-500/15 text-sky-200 ring-1 ring-sky-500/20';

      case 'B2C':
        return 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/20';

      default:
        return 'bg-slate-700 text-slate-100 ring-1 ring-slate-600/50';
    }
  };

  const formatDate = (
    date?: string | Date
  ) => {
    if (!date) return '';

    try {
      return new Date(
        date
      ).toLocaleDateString(
        'vi-VN'
      );
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-40 rounded-full bg-slate-700" />
            <div className="h-3 w-32 rounded-full bg-slate-700" />
          </div>
          <Loading size="sm" className="text-blue-400" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-3xl bg-slate-800/80 p-4 animate-pulse"
            >
              <div className="h-10 w-10 rounded-full bg-slate-700" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 rounded-full bg-slate-700" />
                <div className="h-3 w-1/2 rounded-full bg-slate-700" />
              </div>
              <div className="h-8 w-24 rounded-full bg-slate-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!loading && customerList.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Chưa có khách hàng"
        description="Tạo khách hàng mới để bắt đầu quản lý dữ liệu kinh doanh của bạn."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-700 bg-slate-900 shadow-sm">
      <table className="min-w-[900px] w-full border-separate border-spacing-0 bg-slate-950">
        <thead className="border-b border-slate-700">
          <tr>
            <th className="px-6 py-4 text-left text-slate-300">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={() => {
                        if (allSelected) {
                          setSelectedIds([]);
                          return;
                        }
                        setSelectedIds(
                          customerList.map(
                            (customer) =>
                              customer.id
                          )
                        );
                      }}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-blue-500 focus:ring-blue-400"
                      aria-label="Chọn tất cả"
                    />
                    TÊN KHÁCH HÀNG
                  </label>
            </th>

            <th className="px-6 py-4 text-left text-slate-300">
              EMAIL / ĐIỆN THOẠI
            </th>

            <th className="px-6 py-4 text-left text-slate-300">
              PHÂN LOẠI
            </th>

            <th className="px-6 py-4 text-right text-slate-300">
              NGÂN SÁCH
            </th>

            <th className="px-6 py-4 text-right text-slate-300">
              HÀNH ĐỘNG
            </th>
          </tr>
        </thead>

        <tbody>
          {customerList.map(
            (customer) => (
              <tr
                key={customer.id}
                className="border-b border-slate-700 bg-slate-950 transition duration-150 hover:bg-slate-800/80 hover:shadow-sm"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(
                        customer.id
                      )}
                      onChange={() => {
                        setSelectedIds((prev) => {
                          const exists = prev.includes(
                            customer.id
                          );
                          if (exists) {
                            return prev.filter(
                              (id) => id !== customer.id
                            );
                          }
                          return [...prev, customer.id];
                        });
                      }}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-blue-500 focus:ring-blue-400"
                      aria-label={`Chọn ${customer.name}`}
                    />
                    <div>
                      <div className="text-white font-medium">
                        {customer.name}
                      </div>

                      <div className="text-sm text-slate-400">
                        {formatDate(
                          customer.createdAt
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="text-white">
                    {customer.email}
                  </div>

                  <div className="text-sm text-slate-400">
                    {customer.phone}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-2 flex-wrap">
                    {/* TYPE */}
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getTypeColor(
                        customer.type
                      )}`}
                    >
                      {customer.type}
                    </span>

                    {/* TIER */}
                    <span
                      title={customer.tier}
                      className="inline-flex items-center justify-center rounded-full bg-slate-800 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200 ring-1 ring-slate-700"
                    >
                      {customer.tier === 'Kim Cương' ? (
                        <Diamond
                          size={16}
                          className="text-cyan-300"
                        />
                      ) : customer.tier === 'Vàng' ? (
                        <Star
                          size={16}
                          className="text-amber-300"
                        />
                      ) : (
                        <Shield
                          size={16}
                          className="text-slate-300"
                        />
                      )}
                      <span className="sr-only">
                        {customer.tier}
                      </span>
                    </span>

                    {/* STATUS */}
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${getStatusColor(
                        customer.status
                      )}`}
                    >
                      {customer.status}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-right text-white font-semibold">
                  {customer.budget != null
                    ? formatCurrency(customer.budget)
                    : 'Chưa cập nhật'}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() =>
                        onEdit?.(
                          customer
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-600 hover:bg-slate-700"
                      aria-label={`Sửa ${customer.name}`}
                    >
                      <Pencil size={16} />
                      Sửa
                    </button>

                    <button
                      onClick={() =>
                        onDelete?.(
                          customer.id
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:border-rose-500 hover:bg-rose-500"
                      aria-label={`Xóa ${customer.name}`}
                    >
                      <Trash2 size={16} />
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}