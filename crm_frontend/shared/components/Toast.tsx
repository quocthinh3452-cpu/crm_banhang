"use client";

import React, { createContext, useContext, ReactNode } from 'react';

// Simple Toast Context
const ToastContext = createContext({
  showToast: (message: string, type: 'success' | 'error') => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const showToast = (message: string, type: 'success' | 'error') => {
    // Simple implementation: use alert for now
    alert(`${type}: ${message}`);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
};