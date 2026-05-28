'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName?: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
  cancelText?: string;
  confirmText?: string;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  itemName,
  onCancel,
  onConfirm,
  loading = false,
  cancelText = 'Hủy',
  confirmText = 'Xóa',
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        onConfirm();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel, onConfirm]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              onCancel();
            }
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-xl border border-slate-100 bg-white p-6 shadow-2xl shadow-slate-900/10"
            onClick={(event) => event.stopPropagation()}
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-12 w-12 items-center justify-center shrink-0 rounded-xl bg-rose-50 border border-rose-100 text-rose-600">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 id="confirm-dialog-title" className="text-lg font-bold text-slate-900">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  {message}
                </p>
                {itemName ? (
                  <div className="mt-3 rounded-lg bg-slate-50 border border-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700">
                    {itemName}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="inline-flex justify-center items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                title="Esc"
              >
                {cancelText} <span className="text-[10px] opacity-60 ml-1.5">(Esc)</span>
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="inline-flex justify-center items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 active:scale-95 shadow-sm shadow-red-500/10 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                title="Enter"
              >
                {loading ? 'Đang xử lý...' : confirmText} <span className="text-[10px] opacity-75 ml-1.5">(Enter)</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
