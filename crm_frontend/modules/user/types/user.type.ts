export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string; // "PRODUCTS_VIEW,PRODUCTS_MANAGE"
  isActive: number;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface UserRequest {
  name: string;
  email: string;
  password?: string;
  role: string;
  permissions: string;
  isActive: number;
}
