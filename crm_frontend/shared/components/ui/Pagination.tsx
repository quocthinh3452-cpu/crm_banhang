'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  totalElements?: number;
  pageSize?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  totalElements,
  pageSize,
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

  // Tính toán từ-đến để hiển thị thông tin
  const startItem = pageSize ? (currentPage - 1) * pageSize + 1 : null;
  const endItem = pageSize && totalElements ? Math.min(currentPage * pageSize, totalElements) : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-1">
      {/* Thông tin phân trang */}
      <div className="text-sm text-slate-500 font-medium">
        {totalElements !== undefined ? (
          startItem && endItem ? (
            <span>
              Hiển thị <span className="text-slate-800 font-semibold">{startItem}–{endItem}</span>{' '}
              / <span className="text-slate-800 font-semibold">{totalElements}</span> bản ghi
            </span>
          ) : (
            <span>
              Tổng cộng <span className="text-slate-800 font-semibold">{totalElements}</span> bản ghi
            </span>
          )
        ) : (
          <span>
            Trang <span className="text-slate-800 font-semibold">{currentPage}</span>{' '}
            / <span className="text-slate-800 font-semibold">{totalPages}</span>
          </span>
        )}
      </div>

      {/* Điều hướng trang */}
      <div className="flex items-center gap-1">
        {/* Nút Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || disabled}
          className="flex items-center gap-1 px-3 h-9 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 transition-all duration-150 shadow-sm"
          aria-label="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Trước</span>
        </button>

        {/* Render danh sách các trang */}
        <div className="flex items-center gap-1">
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
                disabled={disabled}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-150 border ${
                  isCurrent
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
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
          disabled={currentPage === totalPages || disabled}
          className="flex items-center gap-1 px-3 h-9 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200 transition-all duration-150 shadow-sm"
          aria-label="Trang sau"
        >
          <span className="hidden sm:inline">Sau</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};