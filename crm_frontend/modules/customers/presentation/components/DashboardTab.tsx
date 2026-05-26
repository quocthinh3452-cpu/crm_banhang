'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Activity,
  FileText,
  Archive,
  DollarSign,
  Clock,
} from 'lucide-react';

import {
  TransactionSummary,
} from '@/modules/customers/domain/types';
import { customerRepository } from '@/modules/customers/data/customerRepository';

interface Props {
  customerId: string | number;
}

const cards = [
  {
    key: 'totalContacts',
    label: 'Liên hệ',
    icon: Users,
    accent: 'from-sky-500 to-cyan-500',
  },
  {
    key: 'totalInteractions',
    label: 'Tương tác',
    icon: Activity,
    accent: 'from-violet-500 to-fuchsia-500',
  },
  {
    key: 'totalComplaints',
    label: 'Khiếu nại',
    icon: FileText,
    accent: 'from-amber-500 to-orange-500',
  },
  {
    key: 'totalAttachments',
    label: 'Đính kèm',
    icon: Archive,
    accent: 'from-emerald-500 to-lime-500',
  },
  {
    key: 'totalRevenue',
    label: 'Doanh thu',
    icon: DollarSign,
    accent: 'from-rose-500 to-pink-500',
  },
];

const formatCurrency = (value?: number) =>
  value != null
    ? new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }).format(value)
    : 'N/A';

export default function DashboardTab({
  customerId,
}: Props) {
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);

      try {
        const data = await customerRepository.getCustomerDashboardSummary(
          customerId
        );
        setSummary(data);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [customerId]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-100">
          Dashboard khách hàng
        </h3>
        <p className="text-sm text-slate-400">
          Tổng quan chỉ số và lịch sử tương tác gần nhất.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          const value = summary?.[card.key as keyof TransactionSummary];
          const displayValue =
            card.key === 'totalRevenue'
              ? formatCurrency(value as number | undefined)
              : value ?? 0;

          return (
            <div
              key={card.key}
              className="rounded-3xl border border-slate-700 bg-slate-900 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl h-full min-h-[150px]"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">
                    {card.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-100">
                    {loading ? '...' : displayValue}
                  </p>
                </div>
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-white`}
                >
                  <Icon size={20} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl border border-slate-700 bg-slate-900 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-lg font-semibold text-slate-100">
              Lần tương tác cuối
            </h4>
            <p className="mt-2 text-slate-400">
              {loading
                ? 'Đang tải...'
                : summary?.lastInteractionDate || 'Chưa có tương tác'}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-slate-300">
            <Clock size={16} />
            {loading ? '...' : 'Cập nhật tự động'}
          </span>
        </div>
      </div>
    </div>
  );
}
