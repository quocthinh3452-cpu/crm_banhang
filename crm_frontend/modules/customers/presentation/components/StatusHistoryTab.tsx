'use client';

import React, { useEffect, useState } from 'react';
import {
  Clock3,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

import {
  CustomerStatusHistory,
} from '@/modules/customers/domain/types';
import { customerRepository } from '@/modules/customers/data/customerRepository';

interface Props {
  customerId: string | number;
}

export default function StatusHistoryTab({
  customerId,
}: Props) {
  const [history, setHistory] = useState<CustomerStatusHistory[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      const data = await customerRepository.getStatusHistoryByCustomer(
        customerId
      );
      setHistory(data);
    };

    loadHistory();
  }, [customerId]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-100">
          Lịch sử trạng thái
        </h3>
        <p className="text-sm text-slate-400">
          Giám sát chuyển đổi trạng thái khách hàng theo thời gian.
        </p>
      </div>

      <div className="space-y-6">
        {history.length === 0 && (
          <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6 text-slate-400">
            Chưa có lịch sử thay đổi trạng thái.
          </div>
        )}

        {history.map((item, index) => (
          <div
            key={item.id}
            className="relative rounded-3xl border border-slate-700 bg-slate-900 p-5 shadow-sm"
          >
            <div className="absolute left-5 top-5 h-full w-0.5 bg-slate-700" />
            <div className="relative flex gap-4">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-200">
                <UserCheck size={18} />
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock3 size={14} />
                      <span>{item.changedAt || 'Không rõ'}</span>
                    </div>
                    <h4 className="text-lg font-semibold text-slate-100">
                      {item.oldStatus} <ArrowRight className="inline-block" size={16} /> {item.newStatus}
                    </h4>
                  </div>

                  <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
                    {item.changedBy || 'Hệ thống'}
                  </span>
                </div>

                <p className="text-sm leading-6 text-slate-400">
                  {item.reason || 'Không có lý do'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
