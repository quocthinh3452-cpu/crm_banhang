# Customers Module - Clean Architecture Guide

## 📋 Project Structure

```
modules/customers/
├── domain/                          # Business Logic Layer
│   ├── types.ts                     # Core entities & interfaces
│   ├── constants.ts                 # Business constants
│   └── validation.ts                # Zod schemas
├── data/                            # Data Access Layer
│   ├── customerApi.ts               # HTTP API integration
│   └── customerRepository.ts        # Data repository (mock + real)
└── presentation/                    # Presentation Layer
    ├── components/
    │   ├── CustomerTable.tsx        # Table display
    │   ├── CustomerForm.tsx         # Form (create/edit)
    │   ├── CustomerFilters.tsx      # Search & filters
    │   ├── CustomerDetailModal.tsx  # Modal wrapper
    │   └── index.ts                 # Barrel export
    └── hooks/
        └── useCustomers.ts          # Custom hook

app/crm/customers/
└── page.tsx                         # Main page (composition)
```

## 🏗️ Architecture Layers

### Domain Layer (`domain/`)

**Responsibility**: Define business entities and rules

```typescript
// types.ts - Entity definitions
export interface Customer {
  id: string | number;
  name: string;
  email: string;
  type: CustomerType;
  budget: number;
  status: CustomerStatus;
  createdAt: Date;
}

// constants.ts - Business configuration
export const CUSTOMER_TYPES = [
  { value: "VIP", label: "VIP", color: "bg-yellow-500" },
  // ...
];

// validation.ts - Input validation
export const createCustomerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  // ...
});
```

### Data Layer (`data/`)

**Responsibility**: Handle data fetching and persistence

```typescript
// customerRepository.ts - Main interface
const customerRepository = {
  getCustomers(params): Promise<CustomerListResponse>,
  getCustomerById(id): Promise<Customer>,
  createCustomer(data): Promise<Customer>,
  updateCustomer(id, data): Promise<Customer>,
  deleteCustomer(id): Promise<void>,
  bulkDeleteCustomers(ids): Promise<void>,
};

// Currently using mock data - Replace with customerApi when backend ready
```

### Presentation Layer (`presentation/`)

**Responsibility**: Render UI and handle user interactions

```typescript
// hooks/useCustomers.ts - State management
const {
  customers,
  loading,
  error,
  pagination,
  fetchCustomers,    // Search/filter
  addCustomer,       // POST
  updateCustomer,    // PUT
  deleteCustomer,    // DELETE
  bulkDeleteCustomers,
  setPage,           // Pagination
  resetFilters,      // Clear filters
  clearError,        // Error handling
} = useCustomers();

// components/*.tsx - UI components
<CustomerTable customers={customers} loading={loading} {...} />
<CustomerForm customer={customer} onSubmit={handleSubmit} />
<CustomerFilters onFilterChange={handleFilter} onReset={handleReset} />
```

## 🎨 Dark Theme Design System

All components use CRM dark theme colors:

| Element        | Color     | Class                |
| -------------- | --------- | -------------------- |
| Background     | slate-900 | `bg-slate-900`       |
| Surface        | slate-800 | `bg-slate-800`       |
| Hover/Focus    | slate-700 | `hover:bg-slate-700` |
| Border         | slate-700 | `border-slate-700`   |
| Text Primary   | slate-100 | `text-slate-100`     |
| Text Secondary | slate-300 | `text-slate-300`     |
| Accent         | blue-600  | `bg-blue-600`        |

## 🔄 Data Flow

```
User Action (Click)
    ↓
Component Event Handler
    ↓
useCustomers() Hook
    ↓
customerRepository
    ↓
Mock Data (or API Call)
    ↓
Update State
    ↓
Re-render Component
    ↓
Toast Notification
```

## 📝 Usage Examples

### Adding a Customer

```typescript
// In component
const handleFormSubmit = async (data: CreateCustomerInput) => {
  try {
    await addCustomer(data);
    toast.success("Customer added!");
  } catch (error) {
    toast.error("Failed to add customer");
  }
};
```

### Filtering Customers

```typescript
const handleFilterChange = async (params: Partial<CustomerListParams>) => {
  await fetchCustomers({
    search: params.search,
    type: params.type,
    status: params.status,
    page: 1, // Reset to first page
  });
};
```

### Pagination

```typescript
const handlePageChange = (page: number) => {
  setPage(page);
};
```

## 🔌 Integration Points

### Mock Data → Real API

Currently using `customerRepository` with mock data. To integrate with real backend:

1. **Option A**: Modify `customerRepository.ts` to use `customerApi`

   ```typescript
   async getCustomers(params?: CustomerListParams) {
     return await customerApi.getCustomers(params);
   }
   ```

2. **Option B**: Update `useCustomers` hook to call API directly

### Available API Endpoints (Ready in `customerApi.ts`)

```typescript
GET    /api/customers              // List customers
GET    /api/customers/{id}         // Get single customer
POST   /api/customers              // Create customer
PUT    /api/customers/{id}         // Update customer
DELETE /api/customers/{id}         // Delete customer
POST   /api/customers/bulk-delete  // Bulk delete
```

## ✅ Features Implemented

- ✅ Responsive data table with sorting
- ✅ Pagination (with configurable page size)
- ✅ Search and filtering by type/status
- ✅ Add/Edit customer modal form
- ✅ Form validation (Zod)
- ✅ Bulk delete with confirmation
- ✅ Error handling & toast notifications
- ✅ Loading states with skeleton
- ✅ Dark CRM theme
- ✅ Type-safe throughout

## 🚀 Next Steps

1. **Backend Integration**
   - Replace mock data with real API calls
   - Update `customerRepository.ts`

2. **Features to Add**
   - Customer detail view
   - Export to CSV
   - Advanced filtering
   - Batch actions

3. **Performance**
   - Add pagination on server-side
   - Implement caching
   - Optimize re-renders

## 📚 Dependencies

- `react-hook-form` - Form management
- `zod` - Schema validation
- `react-hot-toast` - Toast notifications
- `lucide-react` - Icons
- `tailwindcss` - Styling

## 🤝 Notes

- **Clean Architecture**: Business logic separated from UI
- **Type Safety**: Full TypeScript with Zod validation
- **Reusability**: Components don't depend on Sidebar/Layout
- **Extensibility**: Easy to add new features without touching layout
- **Testing**: Hook and components are easily testable
