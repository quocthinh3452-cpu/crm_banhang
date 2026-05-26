// src/shared/components/ui/Modal.tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;// thêm prop để tùy chỉnh max-width của modal, mặc định là "max-w-2xl"
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children ,maxWidth = "max-w-2xl"}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg shadow-xl w-full ${maxWidth} relative flex flex-col`}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
};