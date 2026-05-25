import { productTypeApi } from '../api/productType.api'; // Đảm bảo bạn đã tạo file api này

export const getProductTypesUseCase = async () => {
  try {
    // 1. Gọi API (Thường lấy danh sách loại không cần phân trang phức tạp như sản phẩm)
    const data = await productTypeApi.getAll();

    // 2. BẢO VỆ DỮ LIỆU
    // Backend trả về List nên data thường là một mảng trực tiếp
    const rawItems = Array.isArray(data) ? data : [];

    // 3. FORMAT DỮ LIỆU (Data Transformation)
    const formattedItems = rawItems.map((item: any) => ({
      ...item,
      // Chuyển đổi trạng thái số (0, 1) sang text để hiển thị nhanh
      statusLabel: item.isActive === 1 ? 'Đang hoạt động' : 'Đã khóa',
      statusColor: item.isActive === 1 ? 'text-green-600' : 'text-red-600',
      
      // Nếu Backend có trả về ngày tạo, format lại cho đẹp
      formattedCreatedAt: item.createdAt 
        ? new Date(item.createdAt).toLocaleDateString('vi-VN') 
        : '---',
    }));

    // 4. Trả về mảng đã được format
    return formattedItems;

  } catch (error) {
    console.error("Lỗi UseCase: Không lấy được danh sách loại sản phẩm", error);
    return []; // Trả về mảng rỗng nếu lỗi
  }
};