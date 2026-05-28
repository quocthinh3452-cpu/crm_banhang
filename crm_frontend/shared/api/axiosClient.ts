import axios from 'axios';
import toast from 'react-hot-toast';

// Khai báo mở rộng cấu hình AxiosRequestConfig để hỗ trợ cờ skipGlobalToast trong TypeScript
declare module 'axios' {
  export interface AxiosRequestConfig {
    skipGlobalToast?: boolean;
  }
}

const axiosClient = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor xử lý lỗi chung (Global Error Handler)
axiosClient.interceptors.response.use(
  // Điểm mấu chốt: Hàm này bóc tách dữ liệu ra, trả về thẳng payload (không còn bọc trong .data nữa)
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    // Trích xuất thông điệp lỗi thông minh từ cả chuỗi thô (plain-text) lẫn JSON object từ Spring Boot
    const message = typeof data === 'string'
      ? data
      : (data?.message || data?.error || 'Có lỗi xảy ra, vui lòng thử lại sau!');

    if (status === 401) {
      toast.error('Phiên đăng nhập hết hạn!');
      // Chuyển hướng về trang login hoặc logout user
    } else if (status === 403) {
      toast.error('Bạn không có quyền thực hiện thao tác này!');
    } else {
      // Chỉ tự động hiện Toast lỗi toàn cục nếu request KHÔNG cấu hình cờ skipGlobalToast
      if (!error.config?.skipGlobalToast) {
        toast.error(message);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;