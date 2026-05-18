//shared/utils/formatters.ts

/**
 * Định dạng tiền tệ Việt Nam Đồng (VND)
 * Dùng chung cho hiển thị giá sản phẩm, lương, giỏ hàng...
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Định dạng ngày giờ chuẩn (DD/MM/YYYY HH:mm)
 */
export const formatDateTime = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};