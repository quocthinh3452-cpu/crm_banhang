'use client';

interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  'Pending': 'bg-amber-500/15 text-amber-200',
  'Processing': 'bg-sky-500/15 text-sky-200',
  'Resolved': 'bg-emerald-500/15 text-emerald-200',
  'Rejected': 'bg-rose-500/15 text-rose-200',
  'Đang chăm sóc': 'bg-slate-500/15 text-slate-200',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status] ?? 'bg-slate-700/20 text-slate-200'}`}>
      {status}
    </span>
  );
}
