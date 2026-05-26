'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { TextInput } from '@/shared/components/form/TextInput';
import { SelectBox } from '@/shared/components/form/SelectBox';
import { Modal } from '@/shared/components/ui/Modal';
import axiosClient from '@/shared/api/axiosClient';
import toast from 'react-hot-toast';

interface Customer {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
}

interface Contract {
  id: number;
  contractNumber: string;
  customerId: number;
  customerName?: string;
  quoteId?: number;
  templateId?: number;
  signDate?: string;
  expiryDate?: string;
  value: number;
  managerId?: number;
  managerName?: string;
  status: string;
  note?: string;
  createdAt?: string;
}

interface ContractModalProps {
  contract: Contract | null; // Dữ liệu hợp đồng truyền vào nếu ở chế độ cập nhật trạng thái
  onClose: () => void;
  onSaved: () => void;
}

export default function ContractModal({ contract, onClose, onSaved }: ContractModalProps) {
  // --- STATES ---
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State cho Form chính
  const [formData, setFormData] = useState({
    contractNumber: '',
    customerId: '',
    quoteId: '',
    templateId: '',
    signDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    value: '',
    managerId: '',
    status: 'active',
    note: '',
  });

  // isEditMode chỉ TRUE khi hợp đồng thực sự tồn tại trong DB (id > 0)
  // Trường hợp 1-click convert từ Báo giá, contract có id=0 → vẫn là TẠO MỚI
  const isEditMode = !!(contract && contract.id > 0);

  // --- EFFECTS ---

  // 1. Tải danh mục tĩnh (Khách hàng, Người dùng/Quản lý, Báo giá) từ Backend
  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [customersData, usersData, quotesPage]: [any, any, any] = await Promise.all([
          axiosClient.get('/customers'),
          axiosClient.get('/users'),
          axiosClient.get('/quotes?size=100'),
        ]);
        setCustomers(customersData || []);
        setUsers(usersData || []);
        setQuotes(quotesPage.content || []);
      } catch (err) {
        console.error('Lỗi tải danh mục khách hàng/người dùng/báo giá:', err);
      } finally {
        setIsLoadingCatalogs(false);
      }
    };
    loadCatalogs();
  }, []);

  // 2. Điền dữ liệu nếu ở chế độ Chỉnh sửa (Edit)
  useEffect(() => {
    if (contract) {
      setFormData({
        contractNumber: contract.contractNumber || '',
        customerId: contract.customerId ? contract.customerId.toString() : '',
        quoteId: contract.quoteId ? contract.quoteId.toString() : '',
        templateId: contract.templateId ? contract.templateId.toString() : '',
        signDate: contract.signDate || '',
        expiryDate: contract.expiryDate || '',
        value: contract.value ? contract.value.toString() : '',
        managerId: contract.managerId ? contract.managerId.toString() : '',
        status: contract.status || 'active',
        note: contract.note || '',
      });
    }
  }, [contract]);

  // --- LỰA CHỌN CHO DROPDOWN ---
  const customerOptions = useMemo(() => {
    return customers.map(c => ({
      label: c.name,
      value: c.id.toString(),
    }));
  }, [customers]);

  const managerOptions = useMemo(() => {
    return users.map(u => ({
      label: u.name,
      value: u.id.toString(),
    }));
  }, [users]);

  // Dropdown chọn Báo giá nguồn (Chỉ lấy các báo giá đã được duyệt/đã chốt/đã đồng ý)
  const quoteOptions = useMemo(() => {
    const activeQuotes = quotes.filter(q => {
      const status = q.approvalStatus ? q.approvalStatus.toLowerCase() : '';
      return status === 'approved' || status === 'closed' || status === 'accepted';
    });

    const list = activeQuotes.map(q => ({
      label: `#${q.quoteNumber} - ${q.customerName || `Khách hàng #${q.leadId}`} (${q.grandTotal ? q.grandTotal.toLocaleString() : 0}đ)`,
      value: q.id.toString(),
    }));

    return [{ label: '-- Chọn Báo giá để chuyển đổi tự động (Tùy chọn) --', value: '' }, ...list];
  }, [quotes]);

  const statusOptions = [
    { label: 'Kích hoạt (active)', value: 'active' },
    { label: 'Hết hạn (expired)', value: 'expired' },
    { label: 'Hủy bỏ (cancelled)', value: 'cancelled' },
  ];

  // --- HÀM TƯƠNG TÁC ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý đặc biệt khi chọn Báo giá nguồn -> Tự động điền Khách hàng & Giá trị hợp đồng
  const handleQuoteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFormData(prev => {
      const next = { ...prev, quoteId: val };
      if (val) {
        const selectedQ = quotes.find(q => q.id.toString() === val);
        if (selectedQ) {
          next.customerId = selectedQ.leadId ? selectedQ.leadId.toString() : '';
          next.value = selectedQ.grandTotal ? selectedQ.grandTotal.toString() : '';
          toast.success(`⚡ Tự động điền dữ liệu từ Báo giá #${selectedQ.quoteNumber}!`);
        }
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.contractNumber) {
      toast.error('⚠️ Vui lòng nhập số hợp đồng!');
      return;
    }
    if (!formData.customerId) {
      toast.error('⚠️ Vui lòng chọn khách hàng!');
      return;
    }
    if (!formData.value || Number(formData.value) <= 0) {
      toast.error('⚠️ Giá trị hợp đồng phải lớn hơn 0!');
      return;
    }
    if (formData.expiryDate && formData.signDate && new Date(formData.expiryDate) < new Date(formData.signDate)) {
      toast.error('⚠️ Ngày hết hạn không được trước ngày ký hợp đồng!');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode && contract && contract.id > 0) {
        // Theo thiết kế của ContractController, chỉnh sửa sẽ cập nhật trạng thái qua PUT /api/contracts/{id}/status?status=...
        await axiosClient.put(`/contracts/${contract.id}/status`, null, {
          params: { status: formData.status },
        });
        toast.success('Cập nhật trạng thái hợp đồng thành công!');
      } else {
        const payload = {
          contractNumber: formData.contractNumber,
          customerId: parseInt(formData.customerId),
          quoteId: formData.quoteId ? parseInt(formData.quoteId) : null,
          templateId: formData.templateId ? parseInt(formData.templateId) : null,
          signDate: formData.signDate || null,
          expiryDate: formData.expiryDate || null,
          value: parseFloat(formData.value),
          managerId: formData.managerId ? parseInt(formData.managerId) : null,
          status: formData.status,
          note: formData.note || '',
        };
        await axiosClient.post('/contracts', payload);
        toast.success('Tạo hợp đồng mới thành công!');
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error('Lỗi khi lưu hợp đồng:', error);
      // axiosClient interceptor sẽ hiển thị toast lỗi tự động
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEditMode && contract && contract.id > 0 ? `Cập nhật trạng thái hợp đồng #${formData.contractNumber}` : 'Tạo Hợp đồng mới'}
      size="xl"
    >
      {isLoadingCatalogs ? (
        <div className="py-12 flex flex-col justify-center items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-500 text-sm">Đang tải danh mục...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            
            {/* Chọn Báo giá nguồn - Tự động điền dữ liệu */}
            <div className="md:col-span-2">
              <SelectBox
                label="Báo giá nguồn liên kết (Tự động điền Khách hàng & Giá trị)"
                name="quoteId"
                disabled={isEditMode}
                value={formData.quoteId}
                onChange={handleQuoteChange}
                options={quoteOptions}
              />
            </div>

            <TextInput
              label="Số hợp đồng"
              name="contractNumber"
              required
              disabled={isEditMode}
              placeholder="Ví dụ: HĐ-2026-001"
              value={formData.contractNumber}
              onChange={handleChange}
            />

            <SelectBox
              label="Khách hàng"
              name="customerId"
              required
              disabled={isEditMode}
              value={formData.customerId}
              onChange={handleChange}
              options={customerOptions}
            />

            <TextInput
              label="Giá trị hợp đồng (VND)"
              name="value"
              type="number"
              required
              disabled={isEditMode}
              placeholder="Nhập số tiền hợp đồng..."
              value={formData.value}
              onChange={handleChange}
            />

            <SelectBox
              label="Người quản lý hợp đồng"
              name="managerId"
              disabled={isEditMode}
              value={formData.managerId}
              onChange={handleChange}
              options={managerOptions}
            />

            <TextInput
              label="Ngày ký hợp đồng"
              name="signDate"
              type="date"
              disabled={isEditMode}
              value={formData.signDate}
              onChange={handleChange}
            />

            <TextInput
              label="Ngày hết hạn"
              name="expiryDate"
              type="date"
              disabled={isEditMode}
              value={formData.expiryDate}
              onChange={handleChange}
            />

            <TextInput
              label="Mã mẫu hợp đồng (Template ID)"
              name="templateId"
              type="number"
              disabled={isEditMode}
              placeholder="Nhập ID mẫu hợp đồng (nếu có)..."
              value={formData.templateId}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-4">
            <SelectBox
              label="Trạng thái hợp đồng"
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              options={statusOptions}
            />

            <div className="space-y-1">
              <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                Ghi chú / Điều khoản
              </label>
              <textarea
                id="note"
                name="note"
                rows={3}
                disabled={isEditMode}
                placeholder="Nhập các điều khoản hoặc ghi chú bổ sung..."
                value={formData.note}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white text-sm"
              />
            </div>

            {isEditMode && (
              <p className="text-[11px] text-amber-600 font-medium italic">
                * Lưu ý: Trong chế độ cập nhật, bạn chỉ được phép thay đổi trạng thái hợp đồng (`active`, `expired`, `cancelled`) để đảm bảo tính toàn vẹn của hồ sơ hợp đồng pháp lý.
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 border-t border-gray-200 pt-5">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="px-8 py-2 font-bold shadow-md shadow-blue-500/10"
            >
              Lưu hợp đồng
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
