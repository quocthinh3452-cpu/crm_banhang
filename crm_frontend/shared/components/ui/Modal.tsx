// src/shared/components/ui/Modal.tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '5xl';
  showDefaultHeader?: boolean;
  customPadding?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title = '', 
  children, 
  size = 'md',
  showDefaultHeader = true,
  customPadding = 'p-6'
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '5xl': 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 backdrop-blur-sm p-4">
      <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} ${customPadding} relative max-h-[90vh] overflow-y-auto`}>
        {showDefaultHeader && (
          <>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold leading-none">
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
          </>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};