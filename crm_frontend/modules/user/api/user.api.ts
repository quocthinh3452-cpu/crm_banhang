import axiosClient from '@/shared/api/axiosClient';
import { User, LoginRequest, UserRequest } from '../types/user.type';

export const userApi = {
  login: async (request: LoginRequest): Promise<User> => {
    return axiosClient.post('/auth/login', request);
  },

  getAll: async (): Promise<User[]> => {
    return axiosClient.get('/users');
  },

  create: async (request: UserRequest): Promise<User> => {
    return axiosClient.post('/users', request);
  },

  update: async (id: number, request: UserRequest): Promise<User> => {
    return axiosClient.put(`/users/${id}`, request);
  },

  delete: async (id: number): Promise<void> => {
    return axiosClient.delete(`/users/${id}`);
  },
};
