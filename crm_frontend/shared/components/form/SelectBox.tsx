'use client';

import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  label: string;
  value: string | number;
}

interface SelectBoxProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
  hint?: string;
}

export const SelectBox = forwardRef<HTMLSelectElement, SelectBoxProps>(
  ({ label, options, error, hint, className = '', id, children, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="w-full flex flex-col">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-2 text-sm font-medium text-slate-200"
          >
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={`w-full px-4 py-2.5 border rounded-lg bg-slate-750 text-slate-100 text-sm appearance-none pr-10 transition-colors outline-none
              ${error 
                ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                : 'border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
              }
              disabled:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed
              ${className}`}
            {...props}
          >
            {children || (
              <>
                <option value="" disabled hidden>-- Chọn một giá trị --</option>
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </>
            )}
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
            size={18}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-400">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
        )}
      </div>
    );
  }
);

SelectBox.displayName = 'SelectBox';