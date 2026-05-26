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
            className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-black/40"
            onClick={(event) => event.stopPropagation()}
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-300">
                <AlertTriangle size={26} />
              </div>
              <div className="flex-1">
                <h3 id="confirm-dialog-title" className="text-xl font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {message}
                </p>
                {itemName ? (
                  <div className="mt-4 rounded-2xl bg-slate-950 px-4 py-3 text-sm text-slate-200 ring-1 ring-slate-700">
                    {itemName}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="inline-flex justify-center rounded-2xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                title="Esc"
              >
                {cancelText} <span className="text-xs opacity-75 ml-2">(Esc)</span>
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="inline-flex justify-center rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
                title="Enter"
              >
                {loading ? 'Đang xóa...' : confirmText} <span className="text-xs opacity-75 ml-2">(Enter)</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
