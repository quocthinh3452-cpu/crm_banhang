'use client'; // Bắt buộc vì có xử lý sự kiện onClick

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
  // Hàm xử lý logic hiển thị số trang với dấu ba chấm (...)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    // Nếu tổng số trang ít (<= 7), hiển thị tất cả
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Nếu đang ở những trang đầu
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
      }
      // Nếu đang ở những trang cuối
      else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      }
      // Nếu đang ở giữa
      else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  // Không hiển thị phân trang nếu chỉ có 1 trang hoặc không có dữ liệu
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-1 mt-6">
      {/* Nút Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
        aria-label="Trang trước"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Render danh sách các trang */}
      <div className="flex items-center space-x-1">
        {getPageNumbers().map((page, index) => {
          // Render dấu 3 chấm
          if (page === '...') {
            return (
              <div 
                key={`ellipsis-${index}`} 
                className="w-9 h-9 flex items-center justify-center text-slate-400"
              >
                <MoreHorizontal className="w-4 h-4" />
              </div>
            );
          }

          const isCurrent = page === currentPage;

          // Render các nút số trang
          return (
            <button
              key={index}
              onClick={() => onPageChange(page as number)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
                isCurrent
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Nút Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
        aria-label="Trang sau"
      >
        <ChevronRight className="w-5 h-5" />
        <ChevronRight size={20} />
      </button>
    </div>
  );
};