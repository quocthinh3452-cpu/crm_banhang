'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

import { Modal } from '@/shared/components/ui/Modal';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { Customer } from '@/modules/customers/domain/types';
import { useEffect } from "react";
import { contactApi } from "../../data/customerApi";
type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number }>;

interface TabItem {
  key: string;
  label: string;
  icon: IconComponent;
}

interface CustomerDetailModalProps {
  isOpen: boolean;
  customer: Customer | null;
  activeTab: string;
  tabs: TabItem[];
  onTabChange: (tab: string) => void;
  onClose: () => void;
  onSave: () => void;
  saveLabel?: string;
  saveDisabled?: boolean;
  children?: React.ReactNode;
}

export default function CustomerDetailModal({
  isOpen,
  customer,
  activeTab,
  tabs,
  onTabChange,
  onClose,
  onSave,
  saveLabel = 'Lưu thay đổi',
  saveDisabled = false,
  children,
}: CustomerDetailModalProps) {
  const headerLabel = useMemo(
    () => customer?.name || 'Khách hàng mới',
    [customer]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showDefaultHeader={false}
      customPadding="p-0"
      maxWidth="max-w-6xl"
      className="!bg-white !rounded-2xl border border-gray-200 shadow-2xl shadow-black/40"
    >
      <div className="w-full flex flex-col max-h-[90vh]">
        <div className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
          <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                <Users size={28} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">Chi tiết khách hàng</p>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900">{headerLabel}</h2>
                  <StatusBadge status={customer?.status ?? 'Đang chăm sóc'} />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 cursor-pointer shadow-sm"
              aria-label="Close (Esc)"
              title="Esc"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex w-full overflow-x-auto border-t border-slate-100 bg-white p-2.5 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isDisabled = tab.key !== 'general' && !customer;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => onTabChange(tab.key)}
                  disabled={isDisabled}
                  className={`inline-flex min-w-[130px] items-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-left text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    activeTab === tab.key
                      ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  } ${isDisabled ? 'cursor-not-allowed opacity-40' : ''}`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-6 bg-slate-50/50">
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            {children}
          </div>
        </div>

        <div className="sticky bottom-0 z-30 border-t border-slate-100 bg-white/95 backdrop-blur-xl px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={onClose}
              className="inline-flex justify-center items-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
              title="Esc"
            >
              Hủy <span className="text-[10px] opacity-60 ml-1.5">(Esc)</span>
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saveDisabled}
              className="inline-flex justify-center items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer shadow-md shadow-blue-500/10"
              title="Enter"
            >
              {saveLabel} <span className="text-[10px] opacity-75 ml-1.5">(Enter)</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
