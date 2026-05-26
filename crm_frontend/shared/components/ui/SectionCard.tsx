'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ title, subtitle, children, className = '' }: SectionCardProps) {
  return (
    <motion.div
      className={`rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-sm ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
          {subtitle ? <p className="text-sm text-slate-400">{subtitle}</p> : null}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </motion.div>
  );
}
