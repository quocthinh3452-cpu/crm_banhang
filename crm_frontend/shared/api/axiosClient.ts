// src/shared/api/axiosClient.ts
import axios from 'axios';
// Giả sử bạn có thư viện toast (như react-toastify hoặc react-hot-toast)
import toast from 'react-hot-toast'; 

const axiosClient = axios.create({
  baseURL:'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor gắn Token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token'); // Hoặc lấy từ Cookie
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor xử lý lỗi chung (Global Error Handler)
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau!';

    if (status === 401) {
      toast.error('Phiên đăng nhập hết hạn!');
      // Chuyển hướng về trang login hoặc logout user
    } else if (status === 403) {
      toast.error('Bạn không có quyền thực hiện thao tác này!');
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;