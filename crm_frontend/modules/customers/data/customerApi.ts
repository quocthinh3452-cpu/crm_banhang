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
    const response: any = await axiosClient.get(
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

    const payload = response;

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
    return await axiosClient.get(`${API_BASE}/${id}`);
  },

  /**
   * Create new customer
   */
  createCustomer: async (data: CreateCustomerInput): Promise<Customer> => {
    const sanitizedData = {
      ...data,
      budget: (data.budget === undefined || data.budget === null || isNaN(data.budget)) ? null : Number(data.budget),
      note: data.notes || '', // Map notes (frontend) to note (backend CreateCustomerInput DTO)
    };
    return await axiosClient.post(API_BASE, sanitizedData);
  },

  /**
   * Update existing customer
   */
  updateCustomer: async (id: string | number, data: UpdateCustomerInput): Promise<Customer> => {
    const sanitizedData = {
      ...data,
      budget: (data.budget === undefined || data.budget === null || isNaN(data.budget)) ? null : Number(data.budget),
      note: data.notes || '', // Map notes (frontend) to note (backend UpdateCustomerInput DTO)
    };
    return await axiosClient.put(`${API_BASE}/${id}`, sanitizedData);
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
    await Promise.all(
      ids.map((id) => axiosClient.delete(`${API_BASE}/${id}`))
    );
  },
};
