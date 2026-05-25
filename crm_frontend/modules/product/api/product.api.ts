import axiosClient from '@/shared/api/axiosClient';
import { Product, PageResult, ProductFilters , ProductRequest} from '../types/product.type';

export const productApi = {
  /**
   * Lấy danh sách sản phẩm kèm theo bộ lọc, phân trang và sắp xếp
   * Khớp với ProductRestController.getProductsData bên Backend
   */
  getProducts: async (filters: ProductFilters): Promise<PageResult<Product>> => {
    return axiosClient.get('/products', {
      params: filters
    });
  },

  /**
   * Lấy danh sách danh mục sản phẩm (Loại sản phẩm)
   * Khớp với ProductTypeRestController bên Backend
   */
  getProductTypes: async () => {
    return axiosClient.get('/product-types');
  },

  /**
   * Hàm xóa sản phẩm
   * Gọi đến: DELETE http://localhost:8080/api/products/{id}
   */
  deleteProduct: async (id: number): Promise<void> => {
    return axiosClient.delete(`/products/${id}`);
  },

  deleteProductType: async (id: number): Promise<void> => {
    return axiosClient.delete(`/product-types/${id}`);
  },

  createProduct: async (data: ProductRequest): Promise<void> => {
    return axiosClient.post('/products', data);
  },

  getProductById: async (id: number): Promise<Product> => {
    return axiosClient.get(`/products/${id}`);
  },

  // Cập nhật sản phẩm
  updateProduct: async (id: number, data: ProductRequest): Promise<void> => {
    return axiosClient.put(`/products/${id}`, data);
  }
};