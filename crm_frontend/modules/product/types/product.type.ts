export interface Product {
  id: number;
  productCode: string;
  name: string;
  typeName: string;
  typeId: number;
  price: number;
  imageUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
export interface ProductRequest {
  productCode: string;
  name: string;
  price: number;
  typeId: number;
  description: string;
  imageUrl?: string; // Có thể để trống nếu không upload ảnh
}
export interface PageResult<T> {
  items: T[];
  totalPages: number;
  currentPage: number;
  totalElements: number;
}
export interface ProductFilters {
  page?: number;
  size?: number;
  keyword?: string;
  typeId?: number;          // Lọc theo loại sản phẩm
  sortBy?: string;          // Trường cần sắp xếp (vd: 'price', 'createdAt')
  sortDirection?: 'asc' | 'desc'; // Hướng sắp xếp (tăng dần/giảm dần)
  sortField?: string; 
  sortDir?: string;
}