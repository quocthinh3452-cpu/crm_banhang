'use client';

import { useEffect, RefObject } from 'react';

/**
 * Hook phát hiện sự kiện click ra ngoài một phần tử (Element)
 * @param ref Ref của phần tử cần theo dõi
 * @param handler Hàm sẽ chạy khi click ra ngoài
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Bỏ qua nếu click vào chính phần tử đó hoặc phần tử không tồn tại
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}