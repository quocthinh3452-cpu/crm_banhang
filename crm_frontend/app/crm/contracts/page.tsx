'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/Button';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { Pagination } from '@/shared/components/ui/Pagination';
import { formatCurrency } from '@/shared/utils/formatters';
import axiosClient from '@/shared/api/axiosClient';
import { Plus, Search, Pencil, Eye } from 'lucide-react';
import ContractModal from './ContractModal';
import ContractDetailModal from './ContractDetailModal';
import toast from 'react-hot-toast';

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

function ContractPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const convertQuoteId = searchParams.get('convertQuoteId');

  // --- STATE ---
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [keyword, setKeyword] = useState('');
  
  // States bộ lọc nâng cao
  const [statusFilter, setStatusFilter] = useState('');
  const [minValueFilter, setMinValueFilter] = useState('');
  const [maxValueFilter, setMaxValueFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);

  // --- EFFECT: Tải danh sách hợp đồng khi page thay đổi ---
  useEffect(() => {
    fetchContracts(page, keyword, statusFilter, minValueFilter, maxValueFilter, startDateFilter, endDateFilter);
  }, [page]);

  // --- EFFECT: Xử lý 1-Click Convert từ trang Báo giá sang ---
  useEffect(() => {
    if (convertQuoteId) {
      const fetchQuoteForConversion = async () => {
        setIsLoading(true);
        try {
          const q: any = await axiosClient.get(`/quotes/${convertQuoteId}`);
          if (q) {
            setSelectedContract({
              id: 0,
              contractNumber: `HD-\${q.quoteNumber}`,
              customerId: q.leadId,
              customerName: q.customerName,
              quoteId: q.id,
              value: q.grandTotal,
              status: 'active',
            });
            setIsModalOpen(true);
            toast.success(`⚡ Đã chuyển đổi dữ liệu từ Báo giá #${q.quoteNumber} thành công!`);
            router.replace('/crm/contracts');
          }
        } catch (err) {
          console.error('Lỗi khi tải thông tin báo giá để tạo hợp đồng:', err);
          toast.error('⚠️ Không thể tải dữ liệu báo giá để chuyển đổi!');
        } finally {
          setIsLoading(false);
        }
      };
      fetchQuoteForConversion();
    }
  }, [convertQuoteId]);

  // --- HÀM XỬ LÝ ---
  const fetchContracts = async (
    currentPage: number, 
    currentKeyword: string,
    statusVal?: string,
    minVal?: string,
    maxVal?: string,
    startD?: string,
    endD?: string
  ) => {
    setIsLoading(true);
    try {
      const data: any = await axiosClient.get('/contracts', {
        params: {
          page: currentPage,
          size: 10,
          keyword: currentKeyword || undefined,
          status: statusVal || undefined,
          minValue: minVal || undefined,
          maxValue: maxVal || undefined,
          startDate: startD || undefined,
          endDate: endD || undefined,
        },
      });

      setContracts(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error('Lỗi tải danh sách hợp đồng:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0); // Reset về trang 1
    fetchContracts(0, keyword, statusFilter, minValueFilter, maxValueFilter, startDateFilter, endDateFilter);
  };

  const handleClearFilters = () => {
    setKeyword('');
    setStatusFilter('');
    setMinValueFilter('');
    setMaxValueFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
    setPage(0);
    fetchContracts(0, '', '', '', '', '', '');
    toast.success('🧹 Đã xóa tất cả bộ lọc tìm kiếm!');
  };

  // Hàm tính toán kiểm tra xem hợp đồng còn thời hạn dưới 30 ngày hay không
  const isExpiringSoon = (expiryDateStr?: string) => {
    if (!expiryDateStr) return false;
    const expiry = new Date(expiryDateStr);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 30;
  };

  const isExpired = (expiryDateStr?: string) => {
    if (!expiryDateStr) return false;
    const expiry = new Date(expiryDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return expiry < today;
  };

  const getExpiryDateClass = (expiryDateStr?: string, status?: string) => {
    if (status === 'cancelled') return 'text-slate-400 line-through font-normal';
    if (!expiryDateStr) return 'text-slate-400 font-normal';
    
    if (isExpired(expiryDateStr) || status === 'expired') {
      return 'text-red-500 font-semibold';
    }
    if (isExpiringSoon(expiryDateStr)) {
      return 'text-orange-500 font-semibold';
    }
    return 'text-slate-400 font-medium';
  };

  const getStatusBadgeClass = (status: string, expiryDate?: string) => {
    if (status === 'active' && isExpiringSoon(expiryDate)) {
      return 'bg-orange-50 text-orange-700 border border-orange-200/60';
    }
    
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
      case 'expired':
        return 'bg-amber-50 text-amber-700 border border-amber-200/60';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-200/60';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200/60';
    }
  };

  const translateStatus = (status: string, expiryDate?: string) => {
    if (status === 'active' && isExpiringSoon(expiryDate)) {
      return 'Sắp hết hạn ⚠️';
    }
    
    switch (status) {
      case 'active':
        return 'Kích hoạt';
      case 'expired':
        return 'Hết hạn';
      case 'cancelled':
        return 'Hủy bỏ';
      default:
        return status;
    }
  };

  const hasActiveFilters = statusFilter || minValueFilter || maxValueFilter || startDateFilter || endDateFilter;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý Hợp đồng
          </h1>
          <p className="text-sm text-slate-500 mt-1">Tạo, cập nhật trạng thái và theo dõi toàn bộ hợp đồng thương mại</p>
        </div>
        <Button
          onClick={() => { setSelectedContract(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 shadow-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200"
        >
          <Plus className="w-4 h-4" /> Tạo Hợp đồng mới
        </Button>
      </div>

      {/* Thanh tìm kiếm chính */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200/60 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label htmlFor="search" className="block mb-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Tìm kiếm nhanh
          </label>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="search"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Nhập số hợp đồng hoặc tên khách hàng (nhấn Enter)..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white text-sm text-slate-800 placeholder-slate-400 font-sans"
            />
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button onClick={handleSearch} className="flex-1 md:flex-none h-11 px-6 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-lg transition-all duration-200 shadow-sm">
            <Search className="w-4 h-4" /> Tìm kiếm
          </Button>
          <button
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className={`h-11 px-4 flex items-center justify-center gap-2 text-sm font-semibold rounded-lg border transition-all duration-200 ${
              isFilterExpanded || hasActiveFilters
                ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100/70'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="Bộ lọc nâng cao"
          >
            <span className="hidden sm:inline">Bộ lọc</span> ⚙️
          </button>
        </div>
      </div>

      {/* Khung Bộ Lọc Nâng Cao (Collapsible) */}
      {isFilterExpanded && (
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm space-y-4 animate-fadeIn transition-all duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Lọc Trạng Thái */}
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">Trạng thái Hợp đồng</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm bg-white text-slate-800 cursor-pointer"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Kích hoạt</option>
                <option value="expiring_soon">Sắp hết hạn ⚠️</option>
                <option value="expired">Hết hạn</option>
                <option value="cancelled">Hủy bỏ</option>
              </select>
            </div>

            {/* Giá tối thiểu */}
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">Giá trị từ (VND)</label>
              <input
                type="number"
                placeholder="Ví dụ: 10000000"
                value={minValueFilter}
                onChange={(e) => setMinValueFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm bg-white text-slate-800"
              />
            </div>

            {/* Giá tối đa */}
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">Giá trị đến (VND)</label>
              <input
                type="number"
                placeholder="Ví dụ: 200000000"
                value={maxValueFilter}
                onChange={(e) => setMaxValueFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm bg-white text-slate-800"
              />
            </div>

            {/* Khoảng ngày ký */}
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">Ngày ký (Từ ngày ~ Đến ngày)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-xs bg-white text-slate-800 cursor-pointer"
                />
                <span className="text-slate-400 text-xs">~</span>
                <input
                  type="date"
                  value={endDateFilter}
                  onChange={(e) => setEndDateFilter(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-xs bg-white text-slate-800 cursor-pointer"
                />
              </div>
            </div>

          </div>

          {/* Dòng nút xóa bộ lọc */}
          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-400 font-medium">Lọc thông minh kết hợp đa tiêu chí linh hoạt</span>
            <button
              onClick={handleClearFilters}
              className="text-xs text-red-500 hover:text-red-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              🧹 Xóa tất cả bộ lọc
            </button>
          </div>
        </div>
      )}

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/75">
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs tracking-wider uppercase whitespace-nowrap">Số hợp đồng</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs tracking-wider uppercase whitespace-nowrap">Khách hàng</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs tracking-wider uppercase text-right whitespace-nowrap">Giá trị hợp đồng</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs tracking-wider uppercase whitespace-nowrap">Người quản lý</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs tracking-wider uppercase text-center whitespace-nowrap">Ngày ký / Hết hạn</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs tracking-wider uppercase text-center whitespace-nowrap">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs tracking-wider uppercase text-center whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-44" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-5 w-28 ml-auto" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-32" /></td>
                    <td className="px-6 py-4 text-center"><Skeleton className="h-5 w-40 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Skeleton className="h-6 w-20 mx-auto rounded-full" /></td>
                    <td className="px-6 py-4 text-center"><Skeleton className="h-8 w-16 mx-auto rounded-md" /></td>
                  </tr>
                ))
              ) : contracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400 text-sm font-medium">
                    Không tìm thấy hợp đồng nào trong hệ thống.
                  </td>
                </tr>
              ) : (
                contracts.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-all duration-150">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      <div className="font-bold text-slate-900">#{c.contractNumber}</div>
                      {c.quoteId && (
                        <div className="text-[9px] bg-blue-50 text-blue-600 border border-blue-100 rounded px-1.5 py-0.5 mt-1 w-fit font-medium">
                          Báo giá: #{c.quoteId}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                      {c.customerName || `Khách hàng #${c.customerId}`}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-blue-600 text-sm">
                      {formatCurrency(c.value)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {c.managerName || `Manager #${c.managerId}`}
                    </td>
                    <td className="px-6 py-4 text-center text-xs whitespace-nowrap">
                      <div className="text-slate-900 font-semibold">Ký: {c.signDate || '-'}</div>
                      <div className={`text-[10px] mt-1 ${getExpiryDateClass(c.expiryDate, c.status)}`}>
                        {c.expiryDate ? `Hạn: ${c.expiryDate}` : 'Vô thời hạn'}
                        {c.expiryDate && isExpired(c.expiryDate) && ' (Hết hạn)'}
                        {c.expiryDate && !isExpired(c.expiryDate) && isExpiringSoon(c.expiryDate) && ' (Sắp hết)'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusBadgeClass(c.status, c.expiryDate)}`}>
                        {translateStatus(c.status, c.expiryDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => { setViewingContract(c); setIsDetailModalOpen(true); }}
                          className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-150 shadow-sm border border-transparent hover:border-blue-200/50 bg-white"
                          title="Xem chi tiết hợp đồng"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setSelectedContract(c); setIsModalOpen(true); }}
                          className="p-1.5 text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-150 shadow-sm border border-transparent hover:border-amber-200/50 bg-white"
                          title="Cập nhật trạng thái hợp đồng"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Thông tin Phân trang */}
        {!isLoading && contracts.length > 0 && (
          <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-200/80">
            <Pagination
              currentPage={page + 1}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={10}
              onPageChange={(p) => setPage(p - 1)}
            />
          </div>
        )}
      </div>

      {/* Modal Hợp đồng */}
      {isModalOpen && (
        <ContractModal
          contract={selectedContract}
          onClose={() => setIsModalOpen(false)}
          onSaved={() => {
            setIsModalOpen(false);
            fetchContracts(page, keyword, statusFilter, minValueFilter, maxValueFilter, startDateFilter, endDateFilter); // Reload danh sách
          }}
        />
      )}

      {/* Modal Chi tiết Hợp đồng */}
      {isDetailModalOpen && viewingContract && (
        <ContractDetailModal
          contract={viewingContract}
          onClose={() => {
            setIsDetailModalOpen(false);
            setViewingContract(null);
          }}
        />
      )}
    </div>
  );
}

export default function ContractManagementPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Đang tải...</div>}>
      <ContractPageInner />
    </Suspense>
  );
}
