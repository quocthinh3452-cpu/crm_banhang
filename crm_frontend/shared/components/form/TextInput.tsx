'use client';

import React, { forwardRef } from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full flex flex-col">
        {label && (
          <label 
            htmlFor={inputId} 
            className="mb-2 text-sm font-medium text-slate-200"
          >
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`px-4 py-2.5 border rounded-lg bg-slate-750 text-slate-100 text-sm placeholder:text-slate-500 transition-colors outline-none
            ${error 
              ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
              : 'border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
            }
            disabled:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />
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

TextInput.displayName = 'TextInput';