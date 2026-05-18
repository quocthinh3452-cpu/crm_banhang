'use client';

import { useState, useEffect } from 'react';

/**
 * Trì hoãn việc cập nhật một giá trị cho đến khi thời gian chờ kết thúc
 * @param value Giá trị cần theo dõi (vd: từ khóa tìm kiếm)
 * @param delay Thời gian chờ (ms), mặc định 500ms
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Thiết lập timeout để cập nhật giá trị sau khoảng delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Xóa timeout nếu value thay đổi trước khi delay kết thúc
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}