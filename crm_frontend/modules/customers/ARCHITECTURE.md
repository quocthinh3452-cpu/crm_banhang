# 📚 Customers Module - Architecture Documentation

## Overview

This document explains the **Clean Architecture** structure of the Customers module with separation of concerns between Domain, Data, and Presentation layers.

## 🏛️ Clean Architecture Principles

The module follows Clean Architecture with three distinct layers:

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                   │
│  (React Components, Hooks, User Interface)              │
│  - CustomerTable, CustomerForm, CustomerFilters         │
│  - useCustomers (Custom Hook)                           │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│                      DATA LAYER                         │
│  (Data Access, Repositories, External Services)         │
│  - customerRepository (CRUD operations)                 │
│  - customerApi (HTTP integration - ready for backend)   │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│                     DOMAIN LAYER                        │
│  (Business Logic, Entities, Validation Rules)           │
│  - types.ts (Entity definitions)                        │
│  - constants.ts (Business configuration)                │
│  - validation.ts (Form validation schemas)              │
└─────────────────────────────────────────────────────────┘
```

## 📁 Layer Breakdown

### Domain Layer (`modules/customers/domain/`)

**Purpose**: Define business entities and rules. Pure business logic with no dependencies on React or external services.

**Files**:

#### `types.ts`

Defines all TypeScript interfaces and types:

```typescript
interface Customer {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  type: CustomerType; // Union type
  budget: number;
  status: CustomerStatus; // Union type
  createdAt: Date;
  updatedAt?: Date;
  notes?: string;
}

type CustomerType = "VIP" | "Tiềm năng" | "Thường xuyên" | "Mới";
type CustomerStatus = "active" | "inactive" | "blocked";

interface CustomerListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: CustomerType;
  status?: CustomerStatus;
  sortBy?: "name" | "budget" | "createdAt";
  sortOrder?: "asc" | "desc";
}
```

#### `constants.ts`

Stores static business configuration:

```typescript
export const CUSTOMER_TYPES = [
  { value: "VIP", label: "VIP", color: "bg-yellow-500" },
  { value: "Tiềm năng", label: "Tiềm năng", color: "bg-blue-500" },
  // ...
];

export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 10,
  PAGE: 1,
};
```

#### `validation.ts`

Zod schemas for runtime validation:

```typescript
const createCustomerSchema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  type: z.enum(["VIP", "Tiềm năng", "Thường xuyên", "Mới"]),
  budget: z.number().min(1000),
  // ...
});

type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;
```

**Characteristics**:

- ✅ No React dependencies
- ✅ No HTTP requests
- ✅ Pure TypeScript interfaces
- ✅ Can be used in Node.js, CLI, or other environments

---

### Data Layer (`modules/customers/data/`)

**Purpose**: Handle data fetching, persistence, and provide an abstraction over data sources.

**Files**:

#### `customerApi.ts`

HTTP service layer (ready for backend integration):

```typescript
const customerApi = {
  getCustomers: (params?: CustomerListParams) => Promise<CustomerListResponse>,
  getCustomerById: (id) => Promise<Customer>,
  createCustomer: (data) => Promise<Customer>,
  updateCustomer: (id, data) => Promise<Customer>,
  deleteCustomer: (id) => Promise<void>,
  bulkDeleteCustomers: (ids) => Promise<void>,
};
```

**Usage**: Call your backend API endpoints through these methods.

#### `customerRepository.ts`

Data repository pattern with **mock data for development**:

```typescript
class CustomerRepository {
  // Methods mirror customerApi
  async getCustomers(params?) {
    /* ... */
  }
  async createCustomer(data) {
    /* ... */
  }
  async updateCustomer(id, data) {
    /* ... */
  }
  // etc.
}

export const customerRepository = new CustomerRepository();
```

**Features**:

- ✅ Full CRUD operations
- ✅ Filtering, sorting, pagination
- ✅ Mock data for testing/development
- ✅ Can be swapped with real API

**How it works**:

1. Current: Uses in-memory mock data
2. Future: Replace with API calls to `customerApi`

**Characteristics**:

- ✅ Abstracts data source (mock vs real API)
- ✅ Implements business logic (filtering, sorting)
- ✅ No React dependencies
- ✅ Testable in isolation

---

### Presentation Layer (`modules/customers/presentation/`)

**Purpose**: Render UI, handle user interactions, and manage component state.

**Structure**:

```
presentation/
├── components/          # React Components
│   ├── CustomerTable.tsx
│   ├── CustomerForm.tsx
│   ├── CustomerFilters.tsx
│   ├── CustomerDetailModal.tsx
│   └── index.ts         # Barrel export
└── hooks/              # Custom React Hooks
    └── useCustomers.ts
```

#### Custom Hook: `useCustomers.ts`

The **centerpiece** of state management:

```typescript
const {
  // State
  customers: Customer[],
  loading: boolean,
  error: string | null,
  pagination: { page, pageSize, total, totalPages },

  // Actions
  fetchCustomers(params),
  addCustomer(data),
  updateCustomer(id, data),
  deleteCustomer(id),
  bulkDeleteCustomers(ids),
  setPage(page),
  resetFilters(),
  clearError(),
} = useCustomers(pageSize = 10);
```

**Features**:

- ✅ Centralized state management (no Redux needed)
- ✅ Handles loading, error, pagination
- ✅ Manages filter state
- ✅ Calls repository methods
- ✅ Easy to test and mock

**Data Flow**:

```
User Action (click button)
    ↓
Component Handler (e.g., handleDelete)
    ↓
Hook Method (e.g., deleteCustomer(id))
    ↓
Repository Call (e.g., customerRepository.deleteCustomer(id))
    ↓
Update Hook State
    ↓
Re-render Component
    ↓
Toast Notification
```

#### Components

**CustomerTable.tsx**

- Displays customer data in table format
- Props: `customers`, `loading`, `onEdit`, `onDelete`, `onSelectionChange`
- Features: Checkboxes for bulk selection, hover effects, dark theme

**CustomerForm.tsx**

- Form for creating/editing customers
- Uses `react-hook-form` + Zod validation
- Props: `customer` (undefined=add, provided=edit), `onSubmit`, `onCancel`

**CustomerFilters.tsx**

- Search and filter controls
- Features: Text search (debounced), type filter, status filter
- Props: `onFilterChange`, `onReset`, `isLoading`

**CustomerDetailModal.tsx**

- Modal wrapper for forms
- Props: `isOpen`, `title`, `onClose`, `children`
- Handles backdrop click, scroll locking

**Characteristics**:

- ✅ React-specific code
- ✅ Presentational components (no business logic)
- ✅ Composed using the custom hook
- ✅ Responsive and dark-themed
- ✅ Accessible (ARIA labels, keyboard nav)

---

## 🔄 Data Flow Example: Add Customer

```
1. User fills form and clicks "Save"
   │
2. CustomerForm.onSubmit() called
   │
3. handleFormSubmit() in page.tsx
   ├─ Calls addCustomer(data) from hook
   │
4. useCustomers.addCustomer()
   ├─ Calls customerRepository.createCustomer(data)
   │
5. customerRepository.createCustomer()
   ├─ Adds to mock data
   ├─ Returns new Customer
   │
6. Hook updates state
   ├─ Re-fetches customer list
   ├─ Clears modal
   │
7. Component re-renders
   ├─ Table shows new customer
   │
8. Toast notification
   └─ "Customer added successfully!"
```

## 🔌 Integration Points

### Switching from Mock to Real API

**Current** (mock data):

```typescript
// customerRepository.ts
async getCustomers(params) {
  // Uses in-memory mockCustomers array
  return filtered and paginated data;
}
```

**After Backend Ready** (real API):

```typescript
// customerRepository.ts
async getCustomers(params) {
  return await customerApi.getCustomers(params);
}

// Repeat for all CRUD methods...
```

### Adding Backend API

1. Implement real endpoints in backend
2. Update `customerApi.ts` with actual endpoints
3. Modify `customerRepository.ts` to call `customerApi`
4. Components and hooks remain unchanged ✨

```typescript
// customerApi.ts
const BASE_URL = "https://api.example.com";

export const customerApi = {
  async getCustomers(params) {
    const response = await fetch(`${BASE_URL}/customers`, {
      params: new URLSearchParams(params),
    });
    return response.json();
  },
  // ...
};
```

## 🧪 Testing Strategy

Each layer can be tested independently:

### Domain Layer

```typescript
// Pure functions, no mocks needed
test('Customer validation', () => {
  const schema = createCustomerSchema;
  expect(schema.parse({ name: 'John', ... })).toBeTruthy();
  expect(() => schema.parse({ name: '' })).toThrow();
});
```

### Data Layer

```typescript
// Mock customerApi if testing repository
test("getCustomers filters by type", async () => {
  const result = await customerRepository.getCustomers({ type: "VIP" });
  expect(result.data).toHaveLength(2);
  expect(result.data[0].type).toBe("VIP");
});
```

### Presentation Layer

```typescript
// Mock hook and repository
test('CustomerTable displays customers', () => {
  render(<CustomerTable customers={mockData} loading={false} />);
  expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument();
});
```

## 📊 File Dependency Map

```
app/crm/customers/page.tsx
    ↓ imports
presentation/hooks/useCustomers.ts
    ↓ imports
data/customerRepository.ts
    ↓ imports
domain/types.ts
domain/constants.ts
domain/validation.ts

presentation/components/*.tsx
    ↓ imports
shared/components/ui/* (Button, Modal, etc.)
shared/components/form/* (TextInput, SelectBox)
shared/utils/formatters.ts
domain/types.ts
domain/constants.ts
```

## 🎯 Design Principles Applied

### Separation of Concerns

- Domain: Pure business logic
- Data: Data access abstraction
- Presentation: UI and user interaction

### Dependency Injection

- Components receive data via props
- Hooks manage state and provide to components
- Repository pattern allows swapping implementations

### Single Responsibility

- Each component does one thing
- Each hook manages one concern
- Each repository method is focused

### Open/Closed Principle

- Easy to extend (add new features)
- Hard to break (don't modify existing code)

### Liskov Substitution

- customerRepository can be replaced with real API
- Same interface, different implementation

## 🚀 Scalability

As the app grows:

1. **Add More Features**
   - New domains: `modules/orders/`, `modules/invoices/`, etc.
   - Follow same structure

2. **Server-Side Pagination**
   - API handles pagination
   - `useCustomers` hook remains unchanged

3. **Advanced Filtering**
   - Add more filter parameters to `CustomerListParams`
   - Update `CustomerFilters` component

4. **Caching**
   - Add cache layer in repository
   - Invalidate on mutations

5. **Real-Time Updates**
   - Replace API calls with WebSocket
   - Same interface, different implementation

---

## 📝 Summary

| Layer            | Purpose                   | Technologies          | Key Files                             |
| ---------------- | ------------------------- | --------------------- | ------------------------------------- |
| **Presentation** | UI & Interaction          | React, TailwindCSS    | components/, hooks/                   |
| **Data**         | Data Access & Persistence | Mock data, HTTP ready | customerRepository.ts, customerApi.ts |
| **Domain**       | Business Rules            | TypeScript, Zod       | types.ts, constants.ts, validation.ts |

**The beauty of this architecture**: You can change the backend API without touching any React components! 🎉
