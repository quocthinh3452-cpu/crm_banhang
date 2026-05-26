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
    <div className={`rounded-3xl border border-slate-700 bg-slate-900 p-8 text-center text-slate-300 shadow-sm ${className}`}>
      <div className="mx-auto mb-5 flex h-18 w-18 items-center justify-center rounded-3xl bg-slate-800 text-slate-200">
        <Icon size={iconSize} />
      </div>
      <h4 className="text-xl font-semibold text-slate-100">{title}</h4>
      <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
