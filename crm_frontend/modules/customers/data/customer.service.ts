/**
 * Customer Service - API Integration Layer
 * Handles all HTTP calls to backend API
 * Backend: http://localhost:8081/api/customers
 */

import { Customer, CustomerListResponse, CustomerListParams } from '../domain/types';

const API_BASE = 'http://localhost:8081/api/customers';

/**
 * Build query string for API parameters
 */
function buildQueryString(params?: CustomerListParams): string {
  if (!params) return '';

  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.pageSize) query.append('pageSize', params.pageSize.toString());
  if (params.search) query.append('search', params.search);
  if (params.type) query.append('type', params.type);
  if (params.status) query.append('status', params.status);
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.sortOrder) query.append('sortOrder', params.sortOrder);

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}

export const customerService = {
  /**
   * Get all customers from backend API
   */
  async getCustomers(params?: CustomerListParams): Promise<CustomerListResponse> {
    try {
      const queryString = buildQueryString(params);
      const response = await fetch(`${API_BASE}${queryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const payload = await response.json();

      if (Array.isArray(payload)) {
        return {
          data: payload,
          total: payload.length,
          page: 1,
          pageSize: payload.length,
          totalPages: 1,
        };
      }

      if (payload && Array.isArray(payload.data)) {
        return payload as CustomerListResponse;
      }

      return {
        data: [],
        total: 0,
        page: 1,
        pageSize: params?.pageSize ?? 10,
        totalPages: 0,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch customers';
      throw new Error(message);
    }
  },

  /**
   * Get single customer by ID
   */
  async getCustomerById(id: string | number): Promise<Customer> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch customer';
      throw new Error(message);
    }
  },

  /**
   * Create new customer
   */
  async createCustomer(data: any): Promise<Customer> {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create customer';
      throw new Error(message);
    }
  },

  /**
   * Update existing customer
   */
  async updateCustomer(id: string | number, data: any): Promise<Customer> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update customer';
      throw new Error(message);
    }
  },

  /**
   * Delete customer by ID
   */
  async deleteCustomer(id: string | number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete customer';
      throw new Error(message);
    }
  },

  /**
   * Bulk delete customers
   */
  async bulkDeleteCustomers(ids: (string | number)[]): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/bulk-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to bulk delete customers';
      throw new Error(message);
    }
  },
};
