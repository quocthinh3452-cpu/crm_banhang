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
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/50';

      case 'Ngừng':
        return 'bg-slate-50 text-slate-750 border border-slate-200/50';

      case 'Blacklist':
        return 'bg-rose-50 text-rose-700 border border-rose-200/50';

      default:
        return 'bg-slate-50 text-slate-750 border border-slate-200/50';
    }
  };

  const getTypeColor = (
    type: string
  ) => {
    switch (type) {
      case 'B2B':
        return 'bg-sky-50 text-sky-700 border border-sky-200/50';

      case 'B2C':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/50';

      default:
        return 'bg-slate-50 text-slate-750 border border-slate-200/50';
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
      <div className="rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-40 rounded-full bg-slate-200" />
            <div className="h-3 w-32 rounded-full bg-slate-150" />
          </div>
          <Loading size="sm" className="text-blue-600" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg bg-slate-50 p-4 animate-pulse"
            >
              <div className="h-10 w-10 rounded-full bg-slate-200" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 rounded-full bg-slate-200" />
                <div className="h-3 w-1/2 rounded-full bg-slate-200" />
              </div>
              <div className="h-8 w-24 rounded-full bg-slate-200" />
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
    <div className="bg-white rounded-lg shadow border border-slate-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-gray-600">
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
                        className="h-4 w-4 rounded border-slate-350 bg-white text-blue-600 focus:ring-blue-500 cursor-pointer"
                        aria-label="Chọn tất cả"
                      />
                      TÊN KHÁCH HÀNG
                    </label>
              </th>

              <th className="px-6 py-4 text-left text-gray-600">
                EMAIL / ĐIỆN THOẠI
              </th>

              <th className="px-6 py-4 text-left text-gray-600">
                PHÂN LOẠI
              </th>

              <th className="px-6 py-4 text-right text-gray-600">
                NGÂN SÁCH
              </th>

              <th className="px-6 py-4 text-right text-gray-600">
                HÀNH ĐỘNG
              </th>
            </tr>
          </thead>

          <tbody>
            {customerList.map(
              (customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 text-sm border-b"
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
                        className="h-4 w-4 rounded border-slate-350 bg-white text-blue-600 focus:ring-blue-500 cursor-pointer"
                        aria-label={`Chọn ${customer.name}`}
                      />
                      <div>
                        <div className="text-gray-900 font-bold">
                          {customer.name}
                        </div>

                        <div className="text-xs text-gray-400 mt-0.5">
                          {formatDate(
                            customer.createdAt
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-semibold">
                      {customer.email}
                    </div>

                    <div className="text-xs text-gray-400 mt-0.5">
                      {customer.phone}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      {/* TYPE */}
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getTypeColor(
                          customer.type
                        )}`}
                      >
                        {customer.type}
                      </span>

                      {/* TIER */}
                      <span
                        title={customer.tier}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700"
                      >
                        {customer.tier === 'Kim Cương' ? (
                          <Diamond
                            size={12}
                            className="text-cyan-500 fill-cyan-100"
                          />
                        ) : customer.tier === 'Vàng' ? (
                          <Star
                            size={12}
                            className="text-amber-500 fill-amber-100"
                          />
                        ) : (
                          <Shield
                            size={12}
                            className="text-slate-400"
                          />
                        )}
                        <span>{customer.tier}</span>
                      </span>

                      {/* STATUS */}
                      <span
                        className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(
                          customer.status
                        )}`}
                      >
                        {customer.status}
                      </span>
                    </div>
                  </td>

                <td className="px-6 py-4 text-right text-gray-900 font-semibold">
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
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                      aria-label={`Sửa ${customer.name}`}
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() =>
                        onDelete?.(
                          customer.id
                        )
                      }
                      className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition"
                      aria-label={`Xóa ${customer.name}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  </div>
  );
}