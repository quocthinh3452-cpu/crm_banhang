'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';

import { Plus, AlertCircle, Phone, Mail, FileText, Users } from 'lucide-react';

import { useCustomers } from '@/modules/customers/presentation/hooks/useCustomers';

import {
  CustomerTable,
  CustomerForm,
  CustomerFilters,
  CustomerDetailModal,
  ContactsTab,
  InteractionLogsTab,
  AttachmentsTab,
  DashboardTab,
  ComplaintsTab,
} from '@/modules/customers/presentation/components';

import {
  Customer,
  CreateCustomerInput,
  CustomerListParams,
} from '@/modules/customers/domain/types';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { TextInput } from '@/shared/components/form/TextInput';
import { SelectBox } from '@/shared/components/form/SelectBox';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { Pagination } from '@/shared/components/ui/Pagination';
import { formatCurrency, formatDateTime } from '@/shared/utils/formatters';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// 1. Định nghĩa Schema Validation bằng Zod
const customerSchema = z.object({
  name: z.string().min(2, 'Tên khách hàng phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  type: z.string().min(1, 'Vui lòng chọn nhóm khách hàng'),
  budget: z.coerce.number().min(1000, 'Ngân sách tối thiểu là 1,000đ'),
});
import toast from 'react-hot-toast';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';

export default function CustomersPage() {
  const [
    isFormModalOpen,
    setIsFormModalOpen,
  ] = useState(false);

  const [
    editingCustomer,
    setEditingCustomer,
  ] = useState<Customer | null>(
    null
  );

  const [
    selectedIds,
    setSelectedIds,
  ] = useState<
    (string | number)[]
  >([]);

  const [
    deleteTarget,
    setDeleteTarget,
  ] = useState<{
    ids: (string | number)[];
    label: string;
  } | null>(null);
type CustomerFormValues = z.infer<typeof customerSchema>;

export default function CustomerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [
    activeTab,
    setActiveTab,
  ] = useState<
    | 'general'
    | 'contacts'
    | 'interactions'
    | 'attachments'
    | 'complaints'
    | 'dashboard'
  >('general');

  const customerFormSubmitRef = useRef<HTMLButtonElement | null>(null);
  // 2. Setup React Hook Form
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(customerSchema),
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === 'n') {
        event.preventDefault();
        setEditingCustomer(null);
        setIsFormModalOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    const timer = setTimeout(() => {
      setCustomers([
        { id: 1, name: 'Nguyễn Văn A', email: 'vana@gmail.com', type: 'VIP', budget: 5000000, createdAt: new Date() },
        { id: 2, name: 'Trần Thị B', email: 'thib@gmail.com', type: 'Tiềm năng', budget: 1200000, createdAt: new Date() },
      ]);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = (data: CustomerFormValues) => {
    console.log('Dữ liệu form:', data);
    alert('Thêm khách hàng thành công! Kiểm tra console log.');
    setIsModalOpen(false);
    reset();
  const modalTabs = [
    { key: 'general', label: 'Thông tin chung', icon: Users },
    { key: 'contacts', label: 'Người liên hệ', icon: Phone },
    { key: 'interactions', label: 'Tương tác', icon: Mail },
    { key: 'attachments', label: 'Tài liệu', icon: FileText },
    { key: 'complaints', label: 'Khiếu nại', icon: AlertCircle },
    { key: 'dashboard', label: 'Dashboard', icon: Users },
  ];

  const {
    customers,

    loading,

    error,

    pagination,

    fetchCustomers,

    addCustomer,

    updateCustomer,

    deleteCustomer,

    bulkDeleteCustomers,

    setPage,

    resetFilters,

    clearError,
  } = useCustomers(10);

  /**
   * FILTER
   */
  const handleFilterChange = useCallback(
    async (params: Partial<CustomerListParams>) => {
      try {
        await fetchCustomers(params);
      } catch (error) {
        console.error(error);
      }
    },
    [fetchCustomers]
  );

  /**
   * SUBMIT FORM
   */
  const handleFormSubmit =
    async (
      data: CreateCustomerInput
    ) => {
      setIsSaving(true);

      try {
        if (
          editingCustomer
        ) {
          await updateCustomer(
            editingCustomer.id,
            data
          );

          toast.success(
            'Cập nhật khách hàng thành công!'
          );
        } else {
          await addCustomer(
            data
          );

          toast.success(
            'Thêm khách hàng thành công!'
          );
        }

        setIsFormModalOpen(
          false
        );

        setEditingCustomer(
          null
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Lỗi không xác định';

        toast.error(
          message
        );
      } finally {
        setIsSaving(false);
      }
    };

  const handleModalSave = () => {
    customerFormSubmitRef.current?.click();
  };

  /**
   * DELETE
   */
  const openDeleteConfirm = (
    ids: (string | number)[],
    label: string
  ) => {
    setDeleteTarget({ ids, label });
    setIsConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsConfirmOpen(false);
    setDeleteTarget(null);
  };

  const handleDelete = (
    id: string | number
  ) => {
    openDeleteConfirm(
      [id],
      'khách hàng này'
    );
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      toast.error(
        'Vui lòng chọn khách hàng để xóa!'
      );
      return;
    }

    openDeleteConfirm(
      selectedIds,
      `${selectedIds.length} khách hàng`
    );
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setConfirmLoading(true);

    try {
      if (deleteTarget.ids.length === 1) {
        await deleteCustomer(deleteTarget.ids[0]);
      } else {
        await bulkDeleteCustomers(
          deleteTarget.ids
        );
        setSelectedIds([]);
      }

      toast.success(
        'Xóa khách hàng thành công!'
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Lỗi không xác định';

      toast.error(
        message
      );
    } finally {
      setConfirmLoading(false);
      closeDeleteConfirm();
    }
  };

  /**
   * EDIT
   */
  const handleEdit = (
    customer: Customer
  ) => {
    setEditingCustomer(
      customer
    );

    setActiveTab('general');
    setIsFormModalOpen(
      true
    );
  };

  /**
   * CLOSE MODAL
   */
  const handleCloseModal =
    () => {
      setIsFormModalOpen(
        false
      );

      setEditingCustomer(
        null
      );
      setActiveTab('general');
    };

  /**
   * ERROR SCREEN
   */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-red-500 text-2xl">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Khách hàng</h1>
          <p className="text-sm text-gray-500">Theo dõi và quản lý thông tin khách hàng trong hệ thống CRM</p>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            Quản lý khách hàng
          </h1>

          <p className="text-slate-400">
            Tổng cộng:{' '}
            <span className="font-semibold text-slate-300">
              {pagination.total}
            </span>{' '}
            khách hàng
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          + Thêm khách hàng
        </Button>
      </div>

      {/* Main Content: Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Khách hàng</th>
              <th className="p-4 font-semibold text-gray-600">Phân loại</th>
              <th className="p-4 font-semibold text-gray-600">Ngân sách dự kiến</th>
              <th className="p-4 font-semibold text-gray-600">Ngày tạo</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Sử dụng Skeleton khi đang tải
              [1, 2, 3].map((i) => (
                <tr key={i}>
                  <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="p-4"><Skeleton className="h-4 w-28" /></td>
                  <td className="p-4"><Skeleton className="h-8 w-16 mx-auto" /></td>
                </tr>
              ))
            ) : (
              customers.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">{item.type}</span>
                  </td>
                  <td className="p-4 text-green-600 font-medium">
                    {formatCurrency(item.budget)}
                  </td>
                  <td className="p-4 text-gray-500 text-sm">
                    {formatDateTime(item.createdAt)}
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="outline" className="text-xs py-1 h-8">Chi tiết</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {selectedIds.length >
            0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={
                handleBulkDelete
              }
              disabled={
                loading
              }
            >
              Xóa{' '}
              {
                selectedIds.length
              }
            </Button>
          )}

          <Button
            variant="primary"
            onClick={() => {
              setEditingCustomer(
                null
              );

              setIsFormModalOpen(
                true
              );
            }}
            disabled={loading || isSaving}
            title="Alt+N"
          >
            <Plus
              size={18}
              className="mr-2"
            />

            <span>Thêm khách hàng <span className="text-xs opacity-75">(Alt+N)</span></span>
          </Button>
        </div>
      </div>

      {/* Pagination component */}
      {!isLoading && (
        <Pagination currentPage={1} totalPages={5} onPageChange={(p) => console.log('Chuyển trang:', p)} />
      )}

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-700/30 rounded-lg flex items-start gap-3">
          <AlertCircle
            className="text-red-400 mt-0.5 flex-shrink-0"
            size={20}
          />

          <div className="flex-1">
            <p className="text-red-300 text-sm font-medium">
              Lỗi
            </p>
          <SelectBox
            label="Nhóm khách hàng"
            options={[
              { label: 'Khách hàng VIP', value: 'VIP' },
              { label: 'Khách hàng Tiềm năng', value: 'Potent' },
              { label: 'Khách hàng Mới', value: 'New' },
            ]}
            {...register('type')}
            error={errors.type?.message}
          />

            <p className="text-red-200 text-sm">
              {error}
            </p>
          <TextInput
            label="Ngân sách (VND)"
            type="number"
            {...register('budget')}
            error={errors.budget?.message}
          />

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">
              Lưu thông tin
            </Button>
          </div>

          <button
            onClick={
              clearError
            }
            className="text-red-400 hover:text-red-300 text-sm font-medium"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Filters */}
      <CustomerFilters
        onFilterChange={
          handleFilterChange
        }
        onReset={
          resetFilters
        }
        isLoading={loading}
      />

      {/* Table */}
      <CustomerTable
        customers={customers}
        loading={loading}
        onEdit={handleEdit}
        onDelete={
          handleDelete
        }
        onSelectionChange={
          setSelectedIds
        }
      />

      {/* Pagination */}
      {pagination.totalPages >
        1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={
              pagination.page
            }
            totalPages={
              pagination.totalPages
            }
            onPageChange={
              setPage
            }
            disabled={
              loading
            }
          />
        </div>
      )}

      {/* Modal */}
      <CustomerDetailModal
        isOpen={
          isFormModalOpen
        }
        customer={editingCustomer}
        activeTab={activeTab}
        tabs={modalTabs}
        onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
        onClose={
          handleCloseModal
        }
        onSave={handleModalSave}
        saveDisabled={loading || isSaving}
      >
        {activeTab === 'general' && (
          <CustomerForm
            customer={
              editingCustomer ||
              undefined
            }
            onSubmit={
              handleFormSubmit
            }
            onCancel={
              handleCloseModal
            }
            loading={loading || isSaving}
            hideActions
            submitId="customer-detail-submit"
            submitRef={customerFormSubmitRef}
          />
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-6">
            {editingCustomer ? (
              <ContactsTab
                customerId={
                  editingCustomer.id
                }
                contacts={
                  editingCustomer.contacts ||
                  []
                }
              />
            ) : (
              <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8 text-center text-slate-400">
                Lưu khách hàng trước khi thêm người liên hệ.
              </div>
            )}
          </div>
        )}

        {activeTab === 'interactions' && (
          <div className="space-y-6">
            {editingCustomer ? (
              <InteractionLogsTab
                customerId={
                  editingCustomer.id
                }
                interactions={
                  editingCustomer.interactionLogs ||
                  []
                }
                contacts={
                  editingCustomer.contacts ||
                  []
                }
              />
            ) : (
              <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8 text-center text-slate-400">
                Lưu khách hàng trước khi ghi nhận tương tác.
              </div>
            )}
          </div>
        )}

        {activeTab === 'attachments' && (
          <div className="space-y-6">
            {editingCustomer ? (
              <AttachmentsTab
                customerId={
                  editingCustomer.id
                }
              />
            ) : (
              <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8 text-center text-slate-400">
                Lưu khách hàng trước khi thêm tài liệu.
              </div>
            )}
          </div>
        )}

        {activeTab === 'complaints' && (
          <div className="space-y-6">
            {editingCustomer ? (
              <ComplaintsTab
                customerId={
                  editingCustomer.id
                }
              />
            ) : (
              <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8 text-center text-slate-400">
                Lưu khách hàng trước khi tạo khiếu nại.
              </div>
            )}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {editingCustomer ? (
              <DashboardTab
                customerId={
                  editingCustomer.id
                }
              />
            ) : (
              <div className="rounded-3xl border border-slate-700 bg-slate-900 p-8 text-center text-slate-400">
                Lưu khách hàng trước khi xem dashboard.
              </div>
            )}
          </div>
        )}
      </CustomerDetailModal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Xác nhận xóa khách hàng"
        message={`Bạn có chắc chắn muốn xóa ${deleteTarget?.label}?`}
        itemName={deleteTarget?.label}
        onCancel={closeDeleteConfirm}
        onConfirm={handleConfirmDelete}
        loading={confirmLoading}
        cancelText="Hủy"
        confirmText="Xác nhận xóa"
      />
        </form>
      </Modal>
    </div>
  );
}