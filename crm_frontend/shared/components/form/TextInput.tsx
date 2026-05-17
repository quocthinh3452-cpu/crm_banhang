'use client';

import React, { forwardRef } from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string; // Nhận message lỗi từ Zod
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full flex flex-col mb-4">
        <label htmlFor={inputId} className="mb-1 text-sm font-medium text-gray-700">
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={`px-4 py-2 border rounded-md outline-none transition-colors 
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}
            disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {error && <span className="mt-1 text-sm text-red-500">{error}</span>}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';