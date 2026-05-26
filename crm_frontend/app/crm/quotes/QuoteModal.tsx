'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { TextInput } from '@/shared/components/form/TextInput';
import { SelectBox } from '@/shared/components/form/SelectBox';
import { Modal } from '@/shared/components/ui/Modal';
import { formatCurrency } from '@/shared/utils/formatters';
import axiosClient from '@/shared/api/axiosClient';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface Customer {
  id: number;
  name: string;
}

interface QuoteItem {
  tempId: string; // ID tạm để làm key trong React
  productId: number | '';
  quantity: number;
  unitPrice: number;
  discountPercent: number;
}

interface QuoteModalProps {
  quoteId: number | null;
  onClose: () => void;
  onSaved: () => void;
}

// Danh sách trạng thái khớp với DB enum QuoteStatus
const STATUS_OPTIONS = [
  { label: 'Nháp', value: 'draft' },
  { label: 'Thương thảo', value: 'negotiating' },
  { label: 'Tạm dừng', value: 'paused' },
  { label: 'Đã chốt', value: 'closed' },
  { label: 'Hủy bỏ', value: 'cancelled' },
  { label: 'Thất bại', value: 'failed' },
];

export default function QuoteModal({ quoteId, onClose, onSaved }: QuoteModalProps) {
  // --- STATES ---
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State cho Form chính
  const [formData, setFormData] = useState({
    quoteNumber: '',
    customerId: '',
    quoteDate: new Date().toISOString().split('T')[0],
    validUntil: '',
    status: 'draft',
  });

  // State cho danh sách sản phẩm của báo giá
  const [items, setItems] = useState<QuoteItem[]>([]);

  // --- EFFECTS ---
  
  // 1. Tải danh mục tĩnh (Sản phẩm & Khách hàng)
  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [productsData, customersData]: [any, any] = await Promise.all([
          axiosClient.get('/products'),
          axiosClient.get('/customers'),
        ]);
        setProducts(productsData || []);
        setCustomers(customersData || []);
      } catch (err) {
        console.error('Lỗi tải danh mục sản phẩm/khách hàng:', err);
      } finally {
        setIsLoadingCatalogs(false);
      }
    };
    loadCatalogs();
  }, []);

  // 2. Tải dữ liệu báo giá nếu ở chế độ Chỉnh sửa (Edit)
  useEffect(() => {
    if (quoteId) {
      const loadQuoteDetails = async () => {
        try {
          const data: any = await axiosClient.get(`/quotes/${quoteId}`);
          setFormData({
            quoteNumber: data.quoteNumber || '',
            customerId: data.leadId ? data.leadId.toString() : '',
            quoteDate: data.quoteDate || '',
            validUntil: data.validUntil || '',
            status: (data.approvalStatus || data.status || 'draft').toLowerCase(),
          });
          
          const loadedItems = (data.items || []).map((i: any) => ({
            tempId: Math.random().toString(36).substring(7),
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            discountPercent: i.discountPercent,
          }));
          setItems(loadedItems);
        } catch (err) {
          console.error('Lỗi tải chi tiết báo giá:', err);
        }
      };
      loadQuoteDetails();
    }
  }, [quoteId]);

  // --- XỬ LÝ TÍNH TOÁN TỔNG HỢP ---
  const summary = useMemo(() => {
    let subtotal = 0;
    let totalDisc = 0;
    
    items.forEach(item => {
      const rowTotal = item.quantity * item.unitPrice;
      const rowDisc = rowTotal * (item.discountPercent / 100);
      subtotal += rowTotal;
      totalDisc += rowDisc;
    });

    const tax = (subtotal - totalDisc) * 0.1;
    const grandTotal = subtotal - totalDisc + tax;

    return { subtotal, totalDisc, tax, grandTotal };
  }, [items]);



  // --- LỰC CHỌN CHO DROPDOWN ---
  const customerOptions = useMemo(() => {
    return customers.map(c => ({
      label: c.name,
      value: c.id.toString(),
    }));
  }, [customers]);



  // --- HÀM TƯƠNG TÁC ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddItem = () => {
    setItems(prev => [
      ...prev, 
      { 
        tempId: Math.random().toString(36).substring(7), 
        productId: '', 
        quantity: 1, 
        unitPrice: 0, 
        discountPercent: 0 
      }
    ]);
  };

  const handleRemoveItem = (tempId: string) => {
    setItems(prev => prev.filter(i => i.tempId !== tempId));
  };

  const handleItemChange = (tempId: string, field: keyof QuoteItem, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.tempId === tempId) {
        const updatedItem = { ...item, [field]: value };
        // Tự động điền đơn giá từ danh mục khi chọn sản phẩm
        if (field === 'productId') {
          const prod = products.find(p => p.id === Number(value));
          updatedItem.unitPrice = prod ? prod.price : 0;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerId) {
      toast.error('⚠️ Vui lòng chọn khách hàng!');
      return;
    }
    if (new Date(formData.validUntil) < new Date(formData.quoteDate)) {
      toast.error('⚠️ Ngày hết hạn không được trước ngày lập báo giá!');
      return;
    }
    if (items.length === 0) {
      toast.error('⚠️ Vui lòng thêm ít nhất một sản phẩm!');
      return;
    }

    // Lọc bỏ những dòng chưa chọn sản phẩm
    const validItems = items.filter(i => i.productId !== '');
    if (validItems.length === 0) {
      toast.error('⚠️ Vui lòng chọn sản phẩm hợp lệ trong danh sách mặt hàng!');
      return;
    }

    const payload = {
      quoteNumber: formData.quoteNumber,
      leadId: parseInt(formData.customerId),
      quoteDate: formData.quoteDate,
      validUntil: formData.validUntil,
      approvalStatus: formData.status,  // backend dùng approvalStatus làm status
      stage: formData.status,           // gửi cùng giá trị để tương thích
      items: validItems.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        discountPercent: i.discountPercent,
      })),
    };

    setIsSubmitting(true);
    try {
      if (quoteId) {
        await axiosClient.put(`/quotes/${quoteId}`, payload);
        toast.success('Cập nhật báo giá thành công!');
      } else {
        await axiosClient.post('/quotes', payload);
        toast.success('Tạo báo giá mới thành công!');
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error('Lỗi khi lưu báo giá:', error);
      // axiosClient interceptor đã tự động hiển thị toast lỗi
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={quoteId ? `Chỉnh sửa báo giá #${formData.quoteNumber}` : 'Tạo Báo giá mới'} 
      size="5xl"
    >
      {isLoadingCatalogs ? (
        <div className="py-12 flex flex-col justify-center items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-500 text-sm">Đang tải danh mục...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Thông tin chung */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <TextInput 
              label="Mã báo giá" 
              name="quoteNumber" 
              required 
              placeholder="Ví dụ: BG-2026-001"
              value={formData.quoteNumber} 
              onChange={handleChange} 
            />
            
            <SelectBox 
              label="Khách hàng" 
              name="customerId" 
              required 
              value={formData.customerId} 
              onChange={handleChange} 
              options={customerOptions}
            />

            <TextInput 
              label="Ngày lập" 
              name="quoteDate" 
              type="date"
              required 
              value={formData.quoteDate} 
              onChange={handleChange} 
            />

            <TextInput 
              label="Ngày hết hạn" 
              name="validUntil" 
              type="date"
              required 
              value={formData.validUntil} 
              onChange={handleChange} 
            />
          </div>

          {/* 2. Chi tiết mặt hàng */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/70">
              <h4 className="font-semibold text-gray-700 text-sm">Chi tiết mặt hàng</h4>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddItem} 
                className="text-xs py-1.5 h-8 flex items-center gap-1.5 border border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm sản phẩm
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <tr>
                    <th className="p-3 pl-4">Sản phẩm</th>
                    <th className="p-3 w-20 text-center">SL</th>
                    <th className="p-3 w-36 text-right">Đơn giá</th>
                    <th className="p-3 w-20 text-center">CK (%)</th>
                    <th className="p-3 w-32 text-right">Tiền CK</th>
                    <th className="p-3 w-36 text-right">Thành tiền</th>
                    <th className="p-3 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <tr key={item.tempId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 pl-4">
                        <select 
                          value={item.productId} 
                          onChange={(e) => handleItemChange(item.tempId, 'productId', e.target.value)} 
                          className="w-full bg-transparent outline-none border border-gray-300 focus:border-blue-500 rounded-md p-1.5 text-sm font-semibold"
                        >
                          <option value="">-- Chọn sản phẩm --</option>
                          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </td>
                      <td className="p-3">
                        <input 
                          type="number" 
                          min="1" 
                          value={item.quantity} 
                          onChange={(e) => handleItemChange(item.tempId, 'quantity', Number(e.target.value))} 
                          className="w-full text-center bg-gray-50 border border-gray-300 focus:border-blue-500 rounded-md p-1.5 text-sm outline-none" 
                        />
                      </td>
                      <td className="p-3 text-right text-gray-500 font-medium">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="p-3">
                        <input 
                          type="number" 
                          min="0" 
                          max="100" 
                          value={item.discountPercent} 
                          onChange={(e) => handleItemChange(item.tempId, 'discountPercent', Number(e.target.value))} 
                          className="w-full text-center bg-gray-50 border border-gray-300 focus:border-blue-500 rounded-md p-1.5 text-sm outline-none" 
                        />
                      </td>
                      <td className="p-3 text-right text-rose-500 font-medium">
                        -{formatCurrency((item.quantity * item.unitPrice * item.discountPercent) / 100)}
                      </td>
                      <td className="p-3 text-right font-semibold text-gray-900">
                        {formatCurrency((item.quantity * item.unitPrice) * (1 - item.discountPercent / 100))}
                      </td>
                      <td className="p-3 text-center">
                        <button 
                          type="button" 
                          onClick={() => handleRemoveItem(item.tempId)} 
                          className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-gray-400 text-sm italic">
                        Báo giá chưa có mặt hàng nào. Vui lòng bấm nút "Thêm sản phẩm" phía trên.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Trạng thái & Bảng tổng hợp thanh toán */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
            {/* Trạng thái báo giá - 1 dropdown duy nhất */}
            <div className="space-y-4">
              <SelectBox
                label="Trạng thái báo giá"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={STATUS_OPTIONS}
              />
            </div>

            {/* Bảng tổng kết số tiền */}
            <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl space-y-3 shadow-lg max-w-lg ml-auto w-full">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Cộng tiền hàng:</span>
                <span className="font-semibold text-slate-200">{formatCurrency(summary.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-rose-400">
                <span>Tổng chiết khấu:</span>
                <span className="font-semibold">-{formatCurrency(summary.totalDisc)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-400">
                <span>Thuế giá trị gia tăng (10% VAT):</span>
                <span className="font-semibold text-slate-200">{formatCurrency(summary.tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-slate-800 pt-3 text-blue-400">
                <span>TỔNG CỘNG THANH TOÁN:</span>
                <span className="font-black text-xl">{formatCurrency(summary.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* 4. Nhóm nút hành động ở cuối */}
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
              Lưu Báo giá
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
