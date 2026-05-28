'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { leadApi, Lead } from '@/modules/lead/services/leadApi';
import { lookupApi, LookupItem } from '@/modules/lead/services/lookupApi';
import { LeadTable } from '@/modules/lead/components/LeadTable';
import { LeadFormModal } from '@/modules/lead/components/LeadFormModal';
import { LeadDetailModal } from '@/modules/lead/components/LeadDetailModal';
import toast from 'react-hot-toast';
import { TextInput } from '@/shared/components/form/TextInput';
import { SelectBox } from '@/shared/components/form/SelectBox';

export default function LeadPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  
  // 1. STATE BỘ LỌC MỞ RỘNG (Khớp với các param Backend có sẵn)
  const [filters, setFilters] = useState({
    keyword: '',
    status: '',
    phone: '',
    provinceId: '',
    salesGroupId: '',
    sourceId: ''
  });

  // Lookup data từ API
  const [provinces, setProvinces] = useState<LookupItem[]>([]);
  const [sources, setSources] = useState<LookupItem[]>([]);
  const [salesGroups, setSalesGroups] = useState<LookupItem[]>([]);

  // State để ẩn/hiện bộ lọc nâng cao
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const showToast = (msg: string) => {
    toast.success(msg);
  };

  const loadLeadsData = async () => {
    setIsLoading(true);
    try {
      const params: any = { page: currentPage, size: 6 };

      // 2. TRUYỀN TOÀN BỘ PARAM XUỐNG BACKEND
      if (filters.keyword?.trim()) params.keyword = filters.keyword.trim();
      if (filters.status) params.status = filters.status;
      if (filters.phone?.trim()) params.phone = filters.phone.trim();
      if (filters.provinceId) params.provinceId = filters.provinceId;
      if (filters.salesGroupId) params.salesGroupId = filters.salesGroupId;
      if (filters.sourceId) params.sourceId = filters.sourceId;

      const response = await leadApi.getAllLeads(params);
      const res: any = response;

      let finalLeads = [];
      let finalTotalPages = 1;
      let finalTotalElements = 0;

      if (res?.content) {
        finalLeads = res.content;
        finalTotalPages = res.totalPages || 1;
        finalTotalElements = res.totalElements || 0;
      } else if (res?.data?.content) {
        finalLeads = res.data.content;
        finalTotalPages = res.data.totalPages || 1;
        finalTotalElements = res.data.totalElements || 0;
      } else if (Array.isArray(res)) {
        finalLeads = res;
        finalTotalElements = res.length;
      }

      setLeads(finalLeads);
      setTotalPages(finalTotalPages);
      setTotalElements(finalTotalElements);
    } catch (error) {
      console.error('Không thể fetch dữ liệu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeadsData();
  }, [currentPage, filters]);

  // Fetch lookup data khi component mount
  useEffect(() => {
    lookupApi.getProvinces().then(setProvinces).catch(() => setProvinces([]));
    lookupApi.getSources().then(setSources).catch(() => setSources([]));
    lookupApi.getSalesGroups().then(setSalesGroups).catch(() => setSalesGroups([]));
  }, []);

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingLead(null);
    showToast("Lưu thông tin thành công!");
    loadLeadsData();
  };

  // Hàm handle thay đổi filter chung
  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1); // Reset về trang 1 mỗi khi lọc
  };

  // Hàm xóa bộ lọc
  const clearFilters = () => {
    setFilters({ keyword: '', status: '', phone: '', provinceId: '', salesGroupId: '', sourceId: '' });
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">

      <style>
        {`
          .fixed.inset-0.bg-black, 
          .fixed.inset-0[class*="bg-"] {
            background-color: rgba(0, 0, 0, 0.4) !important;
            backdrop-filter: blur(4px) !important;
          }
        `}
      </style>



      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Lead</h1>
          <p className="text-sm text-gray-500">Bám sát tiến độ tiếp cận và tối ưu tỷ lệ chuyển đổi</p>
        </div>
        <Button onClick={() => { setEditingLead(null); setIsModalOpen(true); }}>+ Thêm Lead mới</Button>
      </div>

      {/* 3. KHU VỰC BỘ LỌC */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">

        {/* Lọc cơ bản */}
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Tìm tên, công ty..."
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-250 text-sm rounded-lg outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-gray-750 placeholder-gray-400 h-11"
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
          />
          <select
            className="w-1/4 px-4 py-2.5 border border-gray-250 rounded-lg text-sm outline-none focus:border-blue-500 bg-white text-gray-750 cursor-pointer h-11 transition-colors"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">-- Tất cả trạng thái --</option>
            <option value="NEW">Mới nhận</option>
            <option value="CONTACTING">Đang liên hệ</option>
            <option value="CONVERTED">Đã chuyển đổi</option>
            <option value="DROPPED">Ngừng chăm sóc</option>
          </select>

          {/* Nút Bộ lọc nâng cao (Đã chuyển thành Icon cái phễu) */}
          <Button
            variant={showAdvancedFilters ? "primary" : "outline"}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`w-[44px] h-[44px] p-0 flex items-center justify-center shrink-0 rounded-lg transition-all duration-200 ${
              showAdvancedFilters 
                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10' 
                : 'text-slate-650 hover:bg-slate-50'
            }`}
            title="Bộ lọc nâng cao"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </Button>
        </div>

        {/* Lọc nâng cao (Hiển thị dạng Grid) */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

              <input
                type="text"
                placeholder="Số điện thoại..."
                className="px-4 py-2.5 bg-gray-50 border border-gray-250 text-sm rounded-lg outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-gray-750 placeholder-gray-400 h-11"
                value={filters.phone}
                onChange={(e) => handleFilterChange('phone', e.target.value)}
              />

              <select
                className="px-4 py-2.5 border border-gray-250 rounded-lg text-sm outline-none focus:border-blue-500 bg-white text-gray-750 cursor-pointer h-11 transition-colors"
                value={filters.provinceId}
                onChange={(e) => handleFilterChange('provinceId', e.target.value)}
              >
                <option value="">-- Tỉnh / Thành phố --</option>
                {provinces.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <select
                className="px-4 py-2.5 border border-gray-250 rounded-lg text-sm outline-none focus:border-blue-500 bg-white text-gray-750 cursor-pointer h-11 transition-colors"
                value={filters.salesGroupId}
                onChange={(e) => handleFilterChange('salesGroupId', e.target.value)}
              >
                <option value="">-- Nhóm bán hàng --</option>
                {salesGroups.map(sg => (
                  <option key={sg.id} value={sg.id}>{sg.name}</option>
                ))}
              </select>

              <select
                className="px-4 py-2.5 border border-gray-250 rounded-lg text-sm outline-none focus:border-blue-500 bg-white text-gray-750 cursor-pointer h-11 transition-colors"
                value={filters.sourceId}
                onChange={(e) => handleFilterChange('sourceId', e.target.value)}
              >
                <option value="">-- Nguồn khách hàng --</option>
                {sources.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

            </div>

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-medium">Lọc Lead nâng cao giúp tối ưu hóa tập khách hàng tiềm năng</span>
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                🧹 Xóa tất cả bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>

      <LeadTable
        leads={leads}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={6}
        onPageChange={(p: number) => setCurrentPage(p)}
        onEdit={(lead: Lead) => { setEditingLead(lead); setIsModalOpen(true); }}
        onView={(lead: Lead) => { setViewingLead(lead); setIsDetailModalOpen(true); }}
        onDeleteSuccess={() => { showToast("Xóa thành công!"); loadLeadsData(); }}
      />

      <LeadFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleFormSuccess}
        currentLead={editingLead}
      />

      <LeadDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        lead={viewingLead}
      />
    </div>
  );
}