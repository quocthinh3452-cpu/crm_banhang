'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { LucideIcon } from 'lucide-react';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number }>;

interface TimelineItemProps {
  icon: IconComponent;
  title: string;
  description: string;
  date: string;
  author?: string;
  badgeText?: string;
  badgeClass?: string;
  accentClass?: string;
  children?: React.ReactNode;
}

export function TimelineItem({
  icon: Icon,
  title,
  description,
  date,
  author,
  badgeText,
  badgeClass = 'bg-slate-800 text-slate-200',
  accentClass = 'border-slate-700',
  children,
}: TimelineItemProps) {
  return (
    <motion.div
      className={`group overflow-hidden rounded-3xl border ${accentClass} bg-slate-900 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 text-slate-200">
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-base font-semibold text-slate-100">{title}</h4>
              <p className="mt-1 text-sm text-slate-400">{description}</p>
            </div>
            {badgeText ? (
              <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
                {badgeText}
              </span>
            ) : null}
          </div>

          {children ? <div className="mt-4">{children}</div> : null}

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span>{date}</span>
            {author ? <span>• {author}</span> : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
