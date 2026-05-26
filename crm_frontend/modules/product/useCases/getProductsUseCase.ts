import { productApi } from '../api/product.api';
import { ProductFilters } from '../types/product.type';

export const getProductsUseCase = async (filters: ProductFilters) => {
  try {
    // 1. Khởi tạo giá trị mặc định (Sửa: Đưa ...filters xuống dưới cùng để ghi đè các giá trị mặc định)
    const safeFilters = {
      page: 1,
      size: 10,
      keyword: '',
      sortField: 'createdAt',
      sortDir: 'desc',
      ...filters // Nếu filters có giá trị sẽ ghi đè lên các mặc định ở trên
    };

    // 2. Gọi API
    const data = await productApi.getProducts(safeFilters);

    // 3. BẢO VỆ DỮ LIỆU
    const rawItems = data?.items || [];
    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8080';

    // 4. FORMAT DỮ LIỆU (Data Transformation)
    const formattedItems = rawItems.map((item: any) => ({
      ...item,
      // Format tiền tệ chuẩn
      formattedPrice: new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
      }).format(item.price),

      // Format ngày tháng: 2026-04-26T... -> 26/04/2026 21:20
      formattedCreatedAt: item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : '---',
      formattedUpdatedAt: item.updatedAt ? new Date(item.updatedAt).toLocaleString('vi-VN') : '---',
      
      // Xử lý URL ảnh tập trung
      fullImageUrl: item.imageUrl 
        ? `${API_URL}/uploads/${item.imageUrl}` 
        : 'https://placehold.co/100x100?text=No+Image'
    }));

    // 5. Trả về cấu trúc chuẩn
    return {
      items: formattedItems,
      totalPages: data?.totalPages || 1,
      currentPage: data?.currentPage || safeFilters.page, // Lấy từ server trả về là chuẩn nhất
      totalElements: data?.totalElements || 0
    };

  } catch (error) {
    console.error("Lỗi UseCase: Không lấy được danh sách sản phẩm", error);
    return {
      items: [],
      totalPages: 0,
      currentPage: 1,
      totalElements: 0
    };
  }
};