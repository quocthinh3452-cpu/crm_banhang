'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const generatePages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
  <div className="flex flex-col gap-4 mt-6 w-full">
    <div className="text-sm text-gray-500">
      Trang <span className="font-semibold">{currentPage}</span> /{' '}
      <span className="font-semibold">{totalPages}</span>
    </div>

    <div className="flex items-center gap-2 overflow-x-auto pb-2">

      <button
        disabled={currentPage === 1 || disabled}
        onClick={() => onPageChange(currentPage - 1)}
        className="
          h-11 px-5 rounded-xl border border-gray-200
          bg-white text-gray-600
          hover:bg-gray-50
          disabled:opacity-40
        "
      >
        Trước
      </button>

      {generatePages().map((page, index) =>
        page === '...' ? (
          <span
            key={index}
            className="px-2 text-gray-400"
          >
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() =>
              onPageChange(Number(page))
            }
            className={`
              h-11 w-11 rounded-xl border transition
              ${
                currentPage === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }
            `}
          >
            {page}
          </button>
        )
      )}

      {/* INPUT NHẬP TRANG */}
      <div className="flex items-center gap-2 ml-8 shrink-0 bg-yellow-200 p-2">
        <span className="text-sm text-gray-500">
          Đến trang
        </span>

        <input
          type="number"
          min={1}
          max={totalPages}
          placeholder="..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const value = Number(
                (e.target as HTMLInputElement).value
              );

              if (
                value >= 1 &&
                value <= totalPages
              ) {
                onPageChange(value);
              }
            }
          }}
          className="
            w-16 h-11 rounded-xl border
            border-gray-300 text-center
            outline-none
          "
        />
      </div>

      <button
        disabled={
          currentPage === totalPages ||
          disabled
        }
        onClick={() =>
          onPageChange(currentPage + 1)
        }
        className="
          h-11 px-5 rounded-xl border border-gray-200
          bg-white text-gray-600
          hover:bg-gray-50
          disabled:opacity-40
        "
      >
        Sau  
      </button>

    </div>
  </div>
);
}
