import { productApi } from '../api/product.api';
import { ProductRequest } from '../types/product.type';

export const updateProductUseCase = async (id: number, data: ProductRequest) => {
  if (!id) throw new Error("ID sản phẩm không hợp lệ");
  if (data.price < 0) throw new Error("Giá không được âm");
  
  const formData = new FormData();
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }), 'data.json');
  
  return await productApi.updateProduct(id, formData);
};