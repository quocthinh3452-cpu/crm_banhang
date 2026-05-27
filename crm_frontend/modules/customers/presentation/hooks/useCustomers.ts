/**
 * Custom Hook - useCustomers
 */

'use client';

import {
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import {
  Customer,
  CustomerListParams,
  CreateCustomerInput,
} from '@/modules/customers/domain/types';

import { customerRepository } from '../../data/customerRepository';

export interface UseCustomersState {
  customers: Customer[];

  loading: boolean;

  error: string | null;

  pagination: {
    page: number;

    pageSize: number;

    total: number;

    totalPages: number;
  };
}

interface UseCustomersActions {
  fetchCustomers: (
    params?: CustomerListParams
  ) => Promise<void>;

  addCustomer: (
    data: CreateCustomerInput
  ) => Promise<void>;

  updateCustomer: (
    id: string | number,
    data: CreateCustomerInput
  ) => Promise<void>;

  deleteCustomer: (
    id: string | number
  ) => Promise<void>;

  bulkDeleteCustomers: (
    ids: (string | number)[]
  ) => Promise<void>;

  setPage: (
    page: number
  ) => void;

  resetFilters: () => void;

  clearError: () => void;
}

export type UseCustomersReturn =
  UseCustomersState &
    UseCustomersActions;

export const useCustomers = (
  initialPageSize: number = 10
): UseCustomersReturn => {
  const [state, setState] =
    useState<UseCustomersState>({
      customers: [],

      loading: true,

      error: null,

      pagination: {
        page: 1,

        pageSize:
          initialPageSize,

        total: 0,

        totalPages: 0,
      },
    });

  const [filters, setFilters] =
    useState<CustomerListParams>({
      page: 1,

      pageSize:
        initialPageSize,
    });

  const filtersRef =
    useRef<CustomerListParams>(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  /**
   * FETCH CUSTOMERS
   */
  const fetchCustomers =
    useCallback(
      async (
        params?: CustomerListParams
      ) => {
        try {
          setState((prev) => ({
            ...prev,

            loading:
  prev.customers.length === 0,

            error: null,
          }));

          const previousFilters =
            filtersRef.current;

          const finalParams = {
            ...previousFilters,

            ...params,
          };

          const response =
            await customerRepository.getCustomers(
              finalParams
            );

          setState((prev) => ({
            ...prev,

            customers: response.data,

            loading: false,

            pagination: {
              page: response.page,
              pageSize: response.pageSize,
              total: response.total,
              totalPages: response.totalPages,
            },
          }));

          const filtersChanged =
            finalParams.page !== previousFilters.page ||
            finalParams.pageSize !==
              previousFilters.pageSize ||
            finalParams.search !== previousFilters.search ||
            finalParams.type !== previousFilters.type ||
            finalParams.tier !== previousFilters.tier ||
            finalParams.status !== previousFilters.status;

          if (filtersChanged) {
            filtersRef.current = finalParams;
            setFilters(finalParams);
          }
        } catch (error) {
          setState((prev) => ({
            ...prev,

            loading: false,

            error:
              error instanceof Error
                ? error.message
                : 'Có lỗi xảy ra',
          }));
        }
      },
      [initialPageSize]
    );

  /**
   * INITIAL LOAD
   */
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  /**
   * ADD
   */
  const addCustomer =
    async (
      data: CreateCustomerInput
    ) => {
      await customerRepository.createCustomer(
        data
      );

      await fetchCustomers();
    };

  /**
   * UPDATE
   */
  const updateCustomer =
    async (
      id: string | number,
      data: CreateCustomerInput
    ) => {
      await customerRepository.updateCustomer(
        id,
        {
          id,
          ...data,
        }
      );

      await fetchCustomers();
    };

  /**
   * DELETE
   */
  const deleteCustomer =
    async (
      id: string | number
    ) => {
      await customerRepository.deleteCustomer(
        id
      );

      await fetchCustomers();
    };

  /**
   * BULK DELETE
   */
  const bulkDeleteCustomers =
    async (
      ids: (
        | string
        | number
      )[]
    ) => {
      await customerRepository.bulkDeleteCustomers(
        ids
      );

      await fetchCustomers();
    };

  /**
   * SET PAGE
   */
  const setPage = (
    page: number
  ) => {
    fetchCustomers({ page });
  };

  /**
   * RESET FILTERS
   */
  const resetFilters = () => {
    const defaultFilters: CustomerListParams = {
      page: 1,

      pageSize:
        initialPageSize,
    };

    if (
      filtersRef.current.page !== defaultFilters.page ||
      filtersRef.current.pageSize !==
        defaultFilters.pageSize
    ) {
      filtersRef.current = defaultFilters;
      setFilters(defaultFilters);
    }

    fetchCustomers(defaultFilters);
  };

  /**
   * CLEAR ERROR
   */
  const clearError = () => {
    setState((prev) => ({
      ...prev,

      error: null,
    }));
  };

  return {
    ...state,

    fetchCustomers,

    addCustomer,

    updateCustomer,

    deleteCustomer,

    bulkDeleteCustomers,

    setPage,

    resetFilters,

    clearError,
  };
};