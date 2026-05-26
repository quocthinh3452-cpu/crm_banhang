// modules/product/api/productType.api.ts
import axiosClient from '@/shared/api/axiosClient'; // Thay đổi đường dẫn import nếu cần
import { ProductTypeResponse, ProductTypeRequest } from '../types/productType.type';

export const productTypeApi = {
  // 1. Lấy danh sách tất cả danh mục
  getAll: async (): Promise<ProductTypeResponse[]> => {
    // Lưu ý: Nếu axiosClient của bạn chưa cấu hình tự bóc tách .data, 
    // hãy đổi thành: const res = await axiosClient.get(...); return res.data;
    return axiosClient.get('/product-types'); 
  },

  // 2. Thêm mới danh mục
  create: async (data: ProductTypeRequest): Promise<string> => {
    return axiosClient.post('/product-types', data);
  },

  // 3. Xóa danh mục
  delete: async (id: number): Promise<void> => {
    return axiosClient.delete(`/product-types/${id}`);
  },

  // 4. Cập nhật danh mục
  update: async (id: number, data: ProductTypeRequest): Promise<ProductTypeResponse> => {
    return axiosClient.put(`/product-types/${id}`, data);
  }
};