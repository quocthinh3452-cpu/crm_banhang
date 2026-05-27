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
  variant?: 'light' | 'dark';
  containerClassName?: string;
}

export const SelectBox = forwardRef<HTMLSelectElement, SelectBoxProps>(
  ({ label, options, error, hint, className = '', id, children, variant = 'light', containerClassName = 'mb-4', ...props }, ref) => {
    const selectId = id || props.name;

    const labelClass = `mb-1 text-sm font-medium ${variant === 'dark' ? 'text-slate-200' : 'text-gray-700'}`;
    
    const selectClass = `w-full px-4 py-2 border rounded-md appearance-none pr-10 transition-colors outline-none ${
      variant === 'dark'
        ? 'bg-slate-750 text-slate-100 border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
        : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
    } ${
      error
        ? variant === 'dark'
          ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
          : 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
        : ''
    } ${
      props.disabled 
        ? variant === 'dark' 
          ? 'bg-slate-800 opacity-50 cursor-not-allowed' 
          : 'bg-gray-100 cursor-not-allowed text-gray-400' 
        : ''
    } ${className}`;

    return (
      <div className={`w-full flex flex-col ${containerClassName}`}>
        {label && (
          <label htmlFor={selectId} className={labelClass}>
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select id={selectId} ref={ref} className={selectClass} {...props}>
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
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
              variant === 'dark' ? 'text-slate-400' : 'text-gray-500'
            }`}
            size={18}
          />
        </div>
        {error && (
          <p className={`mt-1 text-sm ${variant === 'dark' ? 'text-red-400' : 'text-red-500'}`}>{error}</p>
        )}
        {hint && !error && (
          <p className={`mt-1 text-xs ${variant === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>{hint}</p>
        )}
      </div>
    );
  }
);

SelectBox.displayName = 'SelectBox';