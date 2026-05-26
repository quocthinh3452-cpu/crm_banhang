export interface ProductType {
    id: number;
    typeName: string;
    isActive: number;
}
export interface ProductTypeResponse {
  id: number;
  typeName: string;
  isActive: number;
}
export interface ProductTypeRequest {
  typeName: string;
 isActive: number;
}