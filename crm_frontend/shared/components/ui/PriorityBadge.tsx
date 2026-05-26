'use client';

interface PriorityBadgeProps {
  priority: string;
}

const priorityStyles: Record<string, string> = {
  'High': 'bg-rose-500/15 text-rose-200',
  'Medium': 'bg-orange-500/15 text-orange-200',
  'Low': 'bg-sky-500/15 text-sky-200',
  'Critical': 'bg-red-500/15 text-red-200',
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${priorityStyles[priority] ?? 'bg-slate-700/20 text-slate-200'}`}>
      {priority}
    </span>
  );
}
