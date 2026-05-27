'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { TextInput } from '@/shared/components/form/TextInput';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { Pagination } from '@/shared/components/ui/Pagination';
import { formatCurrency } from '@/shared/utils/formatters';
import axiosClient from '@/shared/api/axiosClient';
import toast from 'react-hot-toast';
import { Plus, Search, Pencil, Trash2, FileSignature, Eye } from 'lucide-react';
import QuoteModal from './QuoteModal';
import QuoteDetailModal from './QuoteDetailModal';
import { useRouter } from 'next/navigation';

interface Quote {
  id: number;
  quoteNumber: string;
  customerName: string;
  quoteDate: string;
  validUntil: string;
  approvalStatus: string;
  stage: string;
  grandTotal: number;
}

export default function QuoteManagementPage() {
  const router = useRouter();
  
  // --- STATE ---
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [keyword, setKeyword] = useState('');
  
  // States bộ lọc nâng cao
  const [statusFilter, setStatusFilter] = useState('');
  const [minTotalFilter, setMinTotalFilter] = useState('');
  const [maxTotalFilter, setMaxTotalFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuoteId, setEditingQuoteId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingQuoteId, setViewingQuoteId] = useState<number | null>(null);

  // --- EFFECT: Tải dữ liệu khi render hoặc thay đổi page ---
  useEffect(() => {
    fetchQuotes(page, keyword, statusFilter, minTotalFilter, maxTotalFilter, startDateFilter, endDateFilter);
  }, [page]);

  // --- HÀM XỬ LÝ ---
  const fetchQuotes = async (
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
      const data: any = await axiosClient.get('/quotes', {
        params: {
          page: currentPage,
          size: 10,
          keyword: currentKeyword || undefined,
          status: statusVal || undefined,
          minTotal: minVal || undefined,
          maxTotal: maxVal || undefined,
          startDate: startD || undefined,
          endDate: endD || undefined,
        },
      });
      
      setQuotes(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error('Lỗi tải báo giá:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0); // Reset về trang 1
    fetchQuotes(0, keyword, statusFilter, minTotalFilter, maxTotalFilter, startDateFilter, endDateFilter);
  };

  const handleClearFilters = () => {
    setKeyword('');
    setStatusFilter('');
    setMinTotalFilter('');
    setMaxTotalFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
    setPage(0);
    fetchQuotes(0, '', '', '', '', '', '');
    toast.success('🧹 Đã xóa tất cả bộ lọc tìm kiếm!');
  };

  const deleteQuote = async (id: number, status: string) => {
    if (status === 'Approved') {
      toast.error('⚠️ Không thể xóa báo giá đã duyệt!'); 
      return; 
    }
    
    if (!confirm('Bạn có chắc chắn muốn xóa báo giá này?')) return;
    
    try {
      await axiosClient.delete(`/quotes/${id}`);
      toast.success('Xóa báo giá thành công!');
      const isLastElementOnPage = quotes.length === 1;
      const newPage = isLastElementOnPage && page > 0 ? page - 1 : page;
      setPage(newPage);
      fetchQuotes(newPage, keyword, statusFilter, minTotalFilter, maxTotalFilter, startDateFilter, endDateFilter);
    } catch (err) {
      console.error('Lỗi khi xóa báo giá:', err);
    }
  };

  const isQuoteExpired = (validUntilStr?: string) => {
    if (!validUntilStr) return false;
    const expiry = new Date(validUntilStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return expiry < today;
  };

  const getStatusBadgeClass = (status: string) => {
    const s = status ? status.toLowerCase() : '';
    switch (s) {
      case 'draft':
        return 'bg-slate-50 text-slate-700 border border-slate-200/60';
      case 'negotiating':
        return 'bg-amber-50 text-amber-700 border border-amber-200/60';
      case 'paused':
        return 'bg-sky-50 text-sky-700 border border-sky-200/60';
      case 'closed':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-200/60';
      case 'failed':
        return 'bg-red-50 text-red-700 border border-red-200/60';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200/60';
    }
  };

  const translateStatus = (status: string) => {
    const s = status ? status.toLowerCase() : '';
    switch (s) {
      case 'draft':
        return 'Nháp';
      case 'negotiating':
        return 'Thương thảo';
      case 'paused':
        return 'Tạm dừng';
      case 'closed':
        return 'Đã chốt';
      case 'cancelled':
        return 'Hủy bỏ';
      case 'failed':
        return 'Thất bại';
      default:
        return status;
    }
  };

  const hasActiveFilters = statusFilter || minTotalFilter || maxTotalFilter || startDateFilter || endDateFilter;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý Báo giá</h1>
          <p className="text-sm text-slate-500 mt-1">Tạo, cập nhật và quản lý báo giá kinh doanh trong hệ thống CRM</p>
        </div>
        <Button 
          onClick={() => { setEditingQuoteId(null); setIsModalOpen(true); }} 
          className="flex items-center gap-2 shadow-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200"
        >
          <Plus className="w-4 h-4" /> Tạo Báo giá mới
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
              placeholder="Nhập mã báo giá hoặc tên khách hàng (nhấn Enter)..."
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
              <label className="block mb-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">Trạng thái Báo giá</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm bg-white text-slate-800 cursor-pointer"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="draft">Nháp</option>
                <option value="negotiating">Thương thảo</option>
                <option value="paused">Tạm dừng</option>
                <option value="closed">Đã chốt</option>
                <option value="cancelled">Hủy bỏ</option>
                <option value="failed">Thất bại</option>
              </select>
            </div>

            {/* Giá tối thiểu */}
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">Tổng tiền từ (VND)</label>
              <input
                type="number"
                placeholder="Ví dụ: 10000000"
                value={minTotalFilter}
                onChange={(e) => setMinTotalFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm bg-white text-slate-800"
              />
            </div>

            {/* Giá tối đa */}
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">Tổng tiền đến (VND)</label>
              <input
                type="number"
                placeholder="Ví dụ: 100000000"
                value={maxTotalFilter}
                onChange={(e) => setMaxTotalFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-sm bg-white text-slate-800"
              />
            </div>

            {/* Khoảng ngày lập */}
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">Ngày lập (Từ ngày ~ Đến ngày)</label>
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
            <span className="text-xs text-slate-400 font-medium">Lọc dữ liệu thông minh theo phân loại thực tế</span>
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
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs tracking-wider uppercase whitespace-nowrap">Mã báo giá</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs tracking-wider uppercase whitespace-nowrap">Khách hàng</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs tracking-wider uppercase text-center whitespace-nowrap">Trạng thái Báo giá</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs tracking-wider uppercase text-right whitespace-nowrap">Tổng cộng</th>
                <th className="px-6 py-4 font-semibold text-slate-500 text-xs tracking-wider uppercase text-center whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="px-6 py-4"><Skeleton className="h-5 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-44" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-24 mx-auto rounded-full" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-5 w-28 ml-auto" /></td>
                    <td className="px-6 py-4 text-center"><Skeleton className="h-8 w-16 mx-auto rounded-md" /></td>
                  </tr>
                ))
              ) : quotes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400 text-sm font-medium">
                    Không tìm thấy báo giá nào phù hợp.
                  </td>
                </tr>
              ) : (
                quotes.map((q) => (
                  <tr key={q.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-all duration-150">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      <div className="font-bold text-slate-900">#{q.quoteNumber}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                        Lập: {q.quoteDate}
                        {q.validUntil && (
                          <span className={isQuoteExpired(q.validUntil) ? 'text-red-500 font-semibold ml-1' : 'ml-1 text-slate-500'}>
                            (Hạn: {q.validUntil}) {isQuoteExpired(q.validUntil) && '⚠️ Hết hạn'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{q.customerName}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusBadgeClass(q.approvalStatus)}`}>
                        {translateStatus(q.approvalStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-blue-600 text-sm">{formatCurrency(q.grandTotal)}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => {
                            setViewingQuoteId(q.id);
                            setIsDetailModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg transition-all duration-150 shadow-sm border text-blue-500 hover:text-blue-600 hover:bg-blue-50 bg-white border-slate-200/50 cursor-pointer"
                          title="Xem chi tiết báo giá"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (q.approvalStatus?.toLowerCase() === 'closed') {
                              router.push(`/crm/contracts?convertQuoteId=${q.id}`);
                            }
                          }}
                          disabled={q.approvalStatus?.toLowerCase() !== 'closed'}
                          className={`p-1.5 rounded-lg transition-all duration-150 shadow-sm border ${
                            q.approvalStatus?.toLowerCase() === 'closed'
                              ? 'text-blue-500 hover:text-blue-600 hover:bg-blue-50 bg-white border-slate-200/50 cursor-pointer'
                              : 'text-gray-300 bg-slate-50 border-slate-100 cursor-not-allowed opacity-40'
                          }`}
                          title={
                            q.approvalStatus?.toLowerCase() === 'closed'
                              ? 'Ký hợp đồng (Chuyển thành Hợp đồng)'
                              : 'Chỉ báo giá "Đã chốt" mới có thể tạo hợp đồng'
                          }
                        >
                          <FileSignature className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (q.approvalStatus?.toLowerCase() !== 'closed') {
                              setEditingQuoteId(q.id); setIsModalOpen(true);
                            }
                          }}
                          disabled={q.approvalStatus?.toLowerCase() === 'closed'}
                          className={`p-1.5 rounded-lg transition-all duration-150 shadow-sm border ${
                            q.approvalStatus?.toLowerCase() === 'closed'
                              ? 'text-gray-300 bg-slate-50 border-slate-100 cursor-not-allowed opacity-40'
                              : 'text-amber-500 hover:text-amber-600 hover:bg-amber-50 bg-white border-slate-200/50 cursor-pointer'
                          }`}
                          title={
                            q.approvalStatus?.toLowerCase() === 'closed'
                              ? 'Báo giá đã chốt — không thể chỉnh sửa'
                              : 'Sửa báo giá'
                          }
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (q.approvalStatus?.toLowerCase() !== 'closed') {
                              deleteQuote(q.id, q.approvalStatus);
                            }
                          }}
                          disabled={q.approvalStatus?.toLowerCase() === 'closed'}
                          className={`p-1.5 rounded-lg transition-all duration-150 shadow-sm border ${
                            q.approvalStatus?.toLowerCase() === 'closed'
                              ? 'text-gray-300 bg-slate-50 border-slate-100 cursor-not-allowed opacity-40'
                              : 'text-red-500 hover:text-red-600 hover:bg-red-50 bg-white border-slate-200/50 cursor-pointer'
                          }`}
                          title={
                            q.approvalStatus?.toLowerCase() === 'closed'
                              ? 'Báo giá đã chốt — không thể xóa'
                              : 'Xóa báo giá'
                          }
                        >
                          <Trash2 className="w-4 h-4" />
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
        {!isLoading && quotes.length > 0 && (
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

      {/* Modal Báo giá */}
      {isModalOpen && (
        <QuoteModal 
          quoteId={editingQuoteId} 
          onClose={() => setIsModalOpen(false)} 
          onSaved={() => {
            setIsModalOpen(false);
            fetchQuotes(page, keyword, statusFilter, minTotalFilter, maxTotalFilter, startDateFilter, endDateFilter);
          }} 
        />
      )}

      {/* Modal Chi tiết Báo giá */}
      {isDetailModalOpen && viewingQuoteId !== null && (
        <QuoteDetailModal 
          quoteId={viewingQuoteId} 
          onClose={() => {
            setIsDetailModalOpen(false);
            setViewingQuoteId(null);
          }} 
        />
      )}
    </div>
  );
}
