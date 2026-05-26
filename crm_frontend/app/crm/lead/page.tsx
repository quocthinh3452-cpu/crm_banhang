'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { leadApi, Lead } from '@/modules/lead/services/leadApi';
import { lookupApi, LookupItem } from '@/modules/lead/services/lookupApi';
import { LeadTable } from '@/modules/lead/components/LeadTable';
import { LeadFormModal } from '@/modules/lead/components/LeadFormModal';
import { LeadDetailModal } from '@/modules/lead/components/LeadDetailModal';

export default function LeadPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  
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
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadLeadsData = async () => {
    setIsLoading(true);
    try {
      const params: any = { page: currentPage, size: 10 };

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

      if (Array.isArray(res)) {
        finalLeads = res;
      } else if (res?.content) {
        finalLeads = res.content;
        finalTotalPages = res.totalPages || 1;
      } else if (res?.data?.content) {
        finalLeads = res.data.content;
        finalTotalPages = res.data.totalPages || 1;
      }

      setLeads(finalLeads);
      setTotalPages(finalTotalPages);
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

      {toast && (
        <div className="fixed top-20 right-5 z-[9999] bg-green-600 text-white px-6 py-3 rounded shadow-xl animate-bounce">
          {toast}
        </div>
      )}

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
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Tìm tên, công ty..."
            className="flex-1 border px-3 py-2 rounded text-sm outline-none focus:border-blue-500"
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
          />
          <select
            className="w-1/4 border px-3 py-2 rounded text-sm outline-none focus:border-blue-500 bg-white"
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
            variant={showAdvancedFilters ? "primary" : "outline"} /* <-- Đổi "default" thành "primary" ở đây */
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`w-[42px] h-[42px] p-0 flex items-center justify-center shrink-0 transition-colors ${showAdvancedFilters ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-600'}`}
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
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-4 gap-4">

              <input
                type="text"
                placeholder="Số điện thoại"
                className="border px-3 py-2 rounded text-sm outline-none focus:border-blue-500"
                value={filters.phone}
                onChange={(e) => handleFilterChange('phone', e.target.value)}
              />

              <select
                className="border px-3 py-2 rounded text-sm outline-none focus:border-blue-500 bg-white"
                value={filters.provinceId}
                onChange={(e) => handleFilterChange('provinceId', e.target.value)}
              >
                <option value="">-- Tỉnh / Thành phố --</option>
                {provinces.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <select
                className="border px-3 py-2 rounded text-sm outline-none focus:border-blue-500 bg-white"
                value={filters.salesGroupId}
                onChange={(e) => handleFilterChange('salesGroupId', e.target.value)}
              >
                <option value="">-- Nhóm bán hàng --</option>
                {salesGroups.map(sg => (
                  <option key={sg.id} value={sg.id}>{sg.name}</option>
                ))}
              </select>

              <select
                className="border px-3 py-2 rounded text-sm outline-none focus:border-blue-500 bg-white"
                value={filters.sourceId}
                onChange={(e) => handleFilterChange('sourceId', e.target.value)}
              >
                <option value="">-- Nguồn khách hàng --</option>
                {sources.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

            </div>

            <div className="flex justify-end mt-3">
              <button
                onClick={clearFilters}
                className="text-sm text-red-500 hover:text-red-700 hover:underline px-2 py-1"
              >
                Xóa tất cả bộ lọc
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