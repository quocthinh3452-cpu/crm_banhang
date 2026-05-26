// src/shared/api/axiosClient.ts
import axios from 'axios';
import toast from 'react-hot-toast'; 

const axiosClient = axios.create({
  // Nếu có biến môi trường thì dùng, nếu không có (hoặc trống) thì tự động gọi sang Spring Boot Port 8080
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor gắn Token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token'); 
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
    const message = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau!';

    if (status === 401) {
      toast.error('Phiên đăng nhập hết hạn!');
    } else if (status === 403) {
      toast.error('Bạn không có quyền thực hiện thao tác này!');
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;