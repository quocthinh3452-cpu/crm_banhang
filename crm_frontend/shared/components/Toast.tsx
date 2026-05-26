"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import toast from 'react-hot-toast';

// Simple Toast Context
const ToastContext = createContext({
  showToast: (message: string, type: 'success' | 'error') => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const showToast = (message: string, type: 'success' | 'error') => {
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
};