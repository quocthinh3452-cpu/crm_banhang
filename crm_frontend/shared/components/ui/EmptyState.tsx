'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  iconSize?: number;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
  iconSize = 32,
}: EmptyStateProps) {
  return (
    <div className={`rounded-xl border border-slate-100 bg-white p-8 text-center text-slate-600 shadow-sm ${className}`}>
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
        <Icon size={iconSize} />
      </div>
      <h4 className="text-lg font-bold text-slate-900">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-md shadow-blue-500/10 active:scale-95 cursor-pointer"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
