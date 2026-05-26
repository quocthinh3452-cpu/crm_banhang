import { productApi } from '../api/product.api';
import { ProductRequest } from '../types/product.type';

/**
 * Use Case: Tạo sản phẩm mới
 * Đóng vai trò là tầng nghiệp vụ (Business Logic) ở Frontend
 */
export const createProductUseCase = async (data: ProductRequest): Promise<void> => {
  
  // 1. KIỂM TRA DỮ LIỆU (Frontend Validation)
  // Việc kiểm tra ở đây giúp giảm tải cho Server và phản hồi ngay lập tức cho người dùng
  
  if (!data.productCode || data.productCode.trim() === '') {
    throw new Error('Mã sản phẩm không được để trống.');
  }

  if (!data.name || data.name.trim() === '') {
    throw new Error('Tên sản phẩm không được để trống.');
  }

  if (data.typeId === 0 || !data.typeId) {
    throw new Error('Vui lòng chọn danh mục cho sản phẩm.');
  }

  // Ép kiểu về số để đảm bảo tính chính xác
  const priceValue = Number(data.price);
  if (isNaN(priceValue) || priceValue < 0) {
    throw new Error('Giá sản phẩm phải là số và không được nhỏ hơn 0.');
  }

  try {
    // 2. CHUẨN HÓA DỮ LIỆU TRƯỚC KHI GỬI
    const sanitizedData: ProductRequest = {
      ...data,
      productCode: data.productCode.trim().toUpperCase(), // Viết hoa mã SP
      name: data.name.trim(),
      price: priceValue,
      description: data.description?.trim() || ''
    };

    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(sanitizedData)], { type: 'application/json' }), 'data.json');

    // 3. GỌI TẦNG API
    await productApi.createProduct(formData);

  } catch (error: any) {
    // 4. XỬ LÝ LỖI TRẢ VỀ TỪ BACKEND
    // Ví dụ: Backend trả về lỗi 400 vì trùng mã sản phẩm (DataIntegrityViolation)
    if (error.response && error.response.data) {
      // Ưu tiên thông báo lỗi chi tiết từ Backend (Spring Boot) gửi về
      throw new Error(error.response.data);
    }
    
    console.error("Lỗi Use Case CreateProduct:", error);
    throw new Error('Không thể kết nối đến máy chủ. Vui lòng thử lại sau!');
  }
};