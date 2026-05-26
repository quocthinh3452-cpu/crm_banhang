/**
 * Customer API Service
 * Handles all HTTP calls to customer endpoints
 */

import axios, { AxiosResponse } from 'axios';
import axiosClient from '@/shared/api/axiosClient';
import {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
  CustomerListResponse,
  CustomerListParams,
} from '../domain/types';

const API_BASE = '/customers';

export const customerApi = {
  /**
   * Get all customers with pagination and filters
   */
  getCustomers: async (params?: CustomerListParams): Promise<CustomerListResponse> => {
    const response: AxiosResponse<CustomerListResponse | Customer[]> = await axiosClient.get(
      API_BASE,
      {
        params: {
          page: params?.page || 1,
          pageSize: params?.pageSize || 10,
          search: params?.search,
          type: params?.type,
          tier: params?.tier,
          status: params?.status,
          sortBy: params?.sortBy || 'createdAt',
          sortOrder: params?.sortOrder || 'desc',
        },
      }
    );

    const payload = response.data;

    if (Array.isArray(payload)) {
      return {
        data: payload,
        total: payload.length,
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        totalPages: 1,
      };
    }

    return payload;
  },

  /**
   * Get single customer by ID
   */
  getCustomerById: async (id: string | number): Promise<Customer> => {
    return await axiosClient
      .get<Customer>(`${API_BASE}/${id}`)
      .then((response) => response.data);
  },

  /**
   * Create new customer
   */
  createCustomer: async (data: CreateCustomerInput): Promise<Customer> => {
    return await axiosClient
      .post<Customer>(API_BASE, data)
      .then((response) => response.data);
  },

  /**
   * Update existing customer
   */
  updateCustomer: async (id: string | number, data: UpdateCustomerInput): Promise<Customer> => {
    return await axiosClient
      .put<Customer>(`${API_BASE}/${id}`, data)
      .then((response) => response.data);
  },

  /**
   * Delete customer by ID
   */
  deleteCustomer: async (id: string | number): Promise<void> => {
    await axiosClient.delete(`${API_BASE}/${id}`);
  },

  /**
   * Bulk delete customers
   */
  bulkDeleteCustomers: async (ids: (string | number)[]): Promise<void> => {
    await axiosClient.post(`${API_BASE}/bulk-delete`, { ids });
  },
};
