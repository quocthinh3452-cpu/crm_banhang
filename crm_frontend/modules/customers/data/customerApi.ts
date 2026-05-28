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

  getContactsByCustomerId: async (
  customerId: string | number
) => {
  return contactApi.getByCustomerId(
    Number(customerId)
  );
},

createContact: async (
  data: any
) => {
  return contactApi.create(
    data
  );
},

updateContact: async (
  id: string | number,
  data: any
) => {
  return contactApi.update(
    Number(id),
    data
  );
},

deleteContact: async (
  id: string | number
) => {
  return contactApi.delete(
    Number(id)
  );
},

getInteractionsByCustomerId: async (
  customerId: string | number
) => {
  return interactionApi.getByCustomerId(
    Number(customerId)
  );
},

createInteraction: async (
  data: any
) => {
  return interactionApi.create(
    data
  );
},

updateInteraction: async (
  id: string | number,
  data: any
) => {
  return interactionApi.update(
    Number(id),
    data
  );
},

deleteInteraction: async (
  id: string | number
) => {
  return interactionApi.delete(
    Number(id)
  );
},


getDocumentsByCustomerId: async (
  customerId: string | number
) => {
  const res = await fetch(
    `http://localhost:8081/api/customer-documents/customer/${customerId}`
  );

  return res.json();
},
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
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;

  const filteredData = payload;

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: filteredData.slice(start, end),
    total: filteredData.length,
    page,
    pageSize,
    totalPages: Math.ceil(filteredData.length / pageSize),
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
export const interactionApi = {
  async getByCustomerId(
    customerId: number
  ) {
    const res = await fetch(
      `http://localhost:8081/api/interactions/customer/${customerId}`
    );

    return res.json();
  },
  

  async create(data: any) {
    const res = await fetch(
      'http://localhost:8081/api/interactions',
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    return res.json();
  },

  async update(
    id: number,
    data: any
  ) {
    const res = await fetch(
      `http://localhost:8081/api/interactions/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    return res.json();
  },

  async delete(id: number) {
    await fetch(
      `http://localhost:8081/api/interactions/${id}`,
      {
        method: 'DELETE',
      }
    );
  },
};
export const contactApi = {
  async getByCustomerId(
    customerId: number
  ) {
    const res = await fetch(
      `http://localhost:8081/api/contacts/customer/${customerId}`
    );

    return res.json();
  },

  async create(data: any) {
    const res = await fetch(
      'http://localhost:8081/api/contacts',
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    return res.json();
  },

  async update(
    id: number,
    data: any
  ) {
    const res = await fetch(
      `http://localhost:8081/api/contacts/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    return res.json();
  },

  async delete(id: number) {
    await fetch(
      `http://localhost:8081/api/contacts/${id}`,
      {
        method: 'DELETE',
      }
    );
  },
};
export const complaintApi = {

  async getByCustomerId(
    customerId: number
  ) {
    const res = await fetch(
      `http://localhost:8081/api/complaints/customer/${customerId}`
    );

    return res.json();
  },

  async create(data: any) {
    const res = await fetch(
      'http://localhost:8081/api/complaints',
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    return res.json();
  },

  async update(
    id: number,
    data: any
  ) {
    const res = await fetch(
      `http://localhost:8081/api/complaints/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    return res.json();
  },

  async delete(id: number) {
    await fetch(
      `http://localhost:8081/api/complaints/${id}`,
      {
        method: 'DELETE',
      }
    );
  },
};
export const dashboardApi = {

  async getByCustomerId(
    customerId: number
  ) {
    const res = await fetch(
      `http://localhost:8081/api/customers/${customerId}/dashboard`
    );

    return res.json();
  },
};