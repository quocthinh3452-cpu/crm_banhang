'use client';

import React, { forwardRef } from 'react';

interface Option {
  label: string;
  value: string | number;
}

interface SelectBoxProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
}

export const SelectBox = forwardRef<HTMLSelectElement, SelectBoxProps>(
  ({ label, options, error, className = '', id, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="w-full flex flex-col mb-4">
        <label htmlFor={selectId} className="mb-1 text-sm font-medium text-gray-700">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
        <select
          id={selectId}
          ref={ref}
          className={`px-4 py-2 border rounded-md outline-none bg-white transition-colors
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}
            disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
          {...props}
        >
          <option value="" disabled hidden>-- Chọn một giá trị --</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="mt-1 text-sm text-red-500">{error}</span>}
      </div>
    );
  }
);

SelectBox.displayName = 'SelectBox';