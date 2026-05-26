/**
 * Barrel export for customers module
 * Import everything from: @/modules/customers
 */

// Domain
export type {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
  CustomerListParams,
  CustomerListResponse,
  PaginationInfo,
} from './domain/types';
export type { CreateCustomerFormData, UpdateCustomerFormData } from './domain/validation';
export { CUSTOMER_TYPES, CUSTOMER_STATUSES, PAGINATION_DEFAULTS } from './domain/constants';

// Data
export { customerApi } from './data/customerApi';
export { customerRepository } from './data/customerRepository';

// Presentation
export { useCustomers } from './presentation/hooks';
export {
  CustomerTable,
  CustomerForm,
  CustomerFilters,
  CustomerDetailModal,
} from './presentation/components';
