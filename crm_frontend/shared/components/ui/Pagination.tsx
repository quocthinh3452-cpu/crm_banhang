'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  disabled = false,
}) => {
  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || disabled}
        className="p-2 rounded-lg text-slate-400 hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
        aria-label="Trang trước"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <div 
                key={`ellipsis-${index}`} 
                className="w-10 h-10 flex items-center justify-center text-slate-500"
              >
                <MoreHorizontal size={18} />
              </div>
            );
          }

          const isCurrent = page === currentPage;

          return (
            <button
              key={index}
              onClick={() => onPageChange(page as number)}
              disabled={disabled}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 ${
                isCurrent
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || disabled}
        className="p-2 rounded-lg text-slate-400 hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
        aria-label="Trang sau"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};