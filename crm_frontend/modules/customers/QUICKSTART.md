# Customers Module - Quick Start

## 🎯 What's Included

A fully functional **Customers Management Module** with:

- Modern dark CRM dashboard theme
- Responsive data table with pagination
- Search & filter functionality
- Add/Edit customer form with validation
- Delete functionality with bulk actions
- Type-safe with TypeScript & Zod
- Clean architecture pattern

## 📦 Directory Layout

```
modules/customers/          ← Domain + Data + Presentation layers
  └─ domain/               ← Business logic (entities, validation, constants)
  └─ data/                 ← Data access (repositories, mock data)
  └─ presentation/         ← UI components & custom hooks

app/crm/customers/
  └─ page.tsx             ← Main container that ties everything together
```

## 🚀 Getting Started

### 1. View the Page

Navigate to `/crm/customers` in your Next.js app

```typescript
// app/crm/customers/page.tsx
export default function CustomersPage() {
  // Uses useCustomers hook for data management
  // Renders components: Table, Filters, Form, Modal
}
```

### 2. Key Features

#### Search & Filter

```typescript
<CustomerFilters
  onFilterChange={handleFilterChange}
  onReset={resetFilters}
/>
```

#### Display Customers

```typescript
<CustomerTable
  customers={customers}
  loading={loading}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

#### Add/Edit Form

```typescript
<CustomerForm
  customer={editingCustomer}
  onSubmit={handleFormSubmit}
  onCancel={handleCloseModal}
/>
```

## 🔌 Using the Hook

The main hook that powers everything:

```typescript
const {
  customers,                // array of Customer objects
  loading,                  // boolean
  error,                    // string | null
  pagination: {
    page,                   // current page
    pageSize,               // items per page
    total,                  // total items
    totalPages,             // calculated total pages
  },
  // Actions:
  fetchCustomers(params),   // Search/filter/fetch
  addCustomer(data),        // Create new
  updateCustomer(id, data), // Update existing
  deleteCustomer(id),       // Delete one
  bulkDeleteCustomers(ids), // Delete multiple
  setPage(page),            // Change page
  resetFilters(),           // Clear filters
  clearError(),             // Dismiss error
} = useCustomers(pageSize = 10);
```

## 🎨 Component Props

### CustomerTable

```typescript
<CustomerTable
  customers={Customer[]}
  loading={boolean}
  onEdit={(customer) => void}
  onDelete={(id) => void}
  onView={(customer) => void}
  onSelectionChange={(ids) => void}
/>
```

### CustomerForm

```typescript
<CustomerForm
  customer={Customer | undefined}  // undefined = add mode, provided = edit mode
  onSubmit={(data) => Promise<void>}
  onCancel={() => void}
  loading={boolean}
/>
```

### CustomerFilters

```typescript
<CustomerFilters
  onFilterChange={(params) => void}
  onReset={() => void}
  isLoading={boolean}
/>
```

## 📋 Mock Data

Current implementation uses mock data with 5 sample customers:

```typescript
{
  id: 1,
  name: 'Nguyễn Văn A',
  email: 'vana@example.com',
  type: 'VIP',
  budget: 50000000,
  status: 'active',
  createdAt: new Date('2024-01-15'),
}
```

To replace with real API:

1. Modify `modules/customers/data/customerRepository.ts`
2. Call `customerApi` methods instead of mock data

## ✨ Features & Behaviors

### Search

- Search by customer name or email
- Debounce built-in via `useDebounce` hook (optional)

### Filter

- By Customer Type (VIP, Tiềm năng, Thường xuyên, Mới)
- By Status (active, inactive, blocked)
- Combinations work together

### Pagination

- Configurable page size (default 10)
- Smart page number display with ellipsis
- Previous/Next navigation
- Click any page number

### Form Validation

- Name: 2-100 characters
- Email: Valid email format
- Phone: Optional, must be valid if provided
- Type: Required dropdown
- Budget: Min 1,000đ, Max 1,000,000,000đ

### Action Handling

- ✅ Add: Opens form modal
- ✅ Edit: Loads customer data in form
- ✅ Delete: Single with confirmation
- ✅ Bulk Delete: Multiple selected customers
- ✅ Toast notifications for all actions

## 🎯 Customization

### Change Page Size

```typescript
const customersData = useCustomers(20); // 20 items per page
```

### Custom Columns in Table

Edit `modules/customers/presentation/components/CustomerTable.tsx`

### Add New Filter

1. Update `CustomerListParams` type in `domain/types.ts`
2. Add filter UI in `CustomerFilters.tsx`
3. Pass to `fetchCustomers()`

### Modify Validation Rules

Edit `modules/customers/domain/validation.ts`

### Update Colors/Theme

Components use Tailwind dark theme classes:

- `bg-slate-*` for backgrounds
- `text-slate-*` for text
- `border-slate-*` for borders
- `bg-blue-*` for accent colors

## 📚 File Reference

| File                                 | Purpose                                     |
| ------------------------------------ | ------------------------------------------- |
| `domain/types.ts`                    | Customer entity & interfaces                |
| `domain/constants.ts`                | Config for types, statuses, validation      |
| `domain/validation.ts`               | Zod schemas for form validation             |
| `data/customerApi.ts`                | API service (ready for backend)             |
| `data/customerRepository.ts`         | Mock data + CRUD (replace with real API)    |
| `presentation/hooks/useCustomers.ts` | React hook for state management             |
| `presentation/components/`           | UI components (Table, Form, Filters, Modal) |

## 🔧 Troubleshooting

### "undefined is not a function" for toast

```typescript
// Make sure ToastProvider is in app/layout.tsx
import { ToastProvider } from '@/shared/components/Toast';

export default function RootLayout({ children }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
```

### Modal not closing

Check that `onClose` callback is properly passed and called

### Data not updating

Ensure `fetchCustomers()` is called after mutations (create/update/delete)

## 🚀 Next: Backend Integration

When you have a backend API ready:

1. Update `customerApi.ts` with real endpoints
2. Modify `customerRepository.ts` to call `customerApi`
3. Remove mock data
4. Deploy and test

Example:

```typescript
// data/customerRepository.ts
async getCustomers(params) {
  // Old: return mockData
  // New: return await customerApi.getCustomers(params);
}
```

---

**That's it!** You now have a production-ready customers module. 🎉
