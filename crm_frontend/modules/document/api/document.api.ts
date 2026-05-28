import axiosClient from '@/shared/api/axiosClient';
import { Document, DocumentRequest } from '../types/document.type';

export const documentApi = {
  getAll: async (): Promise<Document[]> => {
    return axiosClient.get('/documents');
  },

  getById: async (id: number): Promise<Document> => {
    return axiosClient.get(`/documents/${id}`);
  },

  create: async (formData: FormData): Promise<Document> => {
    return axiosClient.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      skipGlobalToast: true,
    } as any);
  },

  update: async (id: number, formData: FormData): Promise<Document> => {
    return axiosClient.put(`/documents/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      skipGlobalToast: true,
    } as any);
  },

  delete: async (id: number): Promise<void> => {
    return axiosClient.delete(`/documents/${id}`);
  },
};
