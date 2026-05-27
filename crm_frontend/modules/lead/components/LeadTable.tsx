import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Skeleton } from '@/shared/components/ui/Skeleton';
import { Modal } from '@/shared/components/ui/Modal';
import { Pagination } from '@/shared/components/ui/Pagination';
import { formatCurrency } from '@/shared/utils/formatters';
import { Lead, leadApi } from '../services/leadApi';


interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (lead: Lead) => void;
  onDeleteSuccess: () => void; // Callback để thông báo cho trang cha
  onView: (lead: Lead) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads, isLoading, currentPage, totalPages, onPageChange, onEdit, onDeleteSuccess, onView
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new_lead': return 'bg-blue-100 text-blue-700';
      case 'contacting': return 'bg-yellow-100 text-yellow-700';
      case 'converted': return 'bg-green-100 text-green-700';
      case 'dropped': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new_lead': return 'Mới nhận';
      case 'contacting': return 'Đang liên hệ';
      case 'converted': return 'Đã chuyển đổi';
      case 'dropped': return 'Ngừng chăm sóc';
      default: return status;
    }
  };

  const confirmDelete = async () => {
    if (leadToDelete?.id) {
      try {
        await leadApi.deleteLead(leadToDelete.id);
        setIsDeleteModalOpen(false);
        onDeleteSuccess(); // Gọi callback để cha hiện Toast
      } catch (error) {
        console.error("Lỗi khi xóa Lead:", error);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Khách hàng / Công ty</th>
              <th className="p-4 font-semibold text-gray-600">Điện thoại</th>
              <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
              <th className="p-4 font-semibold text-gray-600">Doanh số dự kiến</th>
              <th className="p-4 font-semibold text-gray-600">Sản phẩm quan tâm</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? ([1, 2, 3].map((i) => (
              <tr key={i}><td colSpan={6} className="p-4"><Skeleton className="h-10 w-full" /></td></tr>
            ))) : leads.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400">Không có dữ liệu</td></tr>
            ) : leads.map((item: Lead) => (
              <tr key={item.id} className="hover:bg-gray-50 text-sm">
                <td className="p-4 font-medium">{item.name}<div className="text-xs text-gray-400">{item.company || 'Cá nhân'}</div></td>
                <td className="p-4">{item.phone || '-'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </span>
                </td>
                <td className="p-4 text-green-600 font-medium">{formatCurrency(item.expectedRevenue || 0)}</td>
                <td className="p-4 text-xs">{item.serviceInterest || '-'}</td>
                <td className="p-4">
                  <div className="flex items-center justify-center space-x-2">
                    {/* Nút Xem (Mắt) - LUÔN HIỆN MÀU XANH LÁ */}
                    <button
                      onClick={() => onView(item)}
                      className="w-8 h-8 flex items-center justify-center rounded border border-green-200 bg-green-50 text-green-600 hover:bg-green-100 hover:border-green-300 transition-all focus:outline-none"
                      title="Xem chi tiết"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>

                    {/* Nút Sửa (Bút) - LUÔN HIỆN MÀU XANH DƯƠNG */}
                    <button
                      onClick={() => onEdit(item)}
                      className="w-8 h-8 flex items-center justify-center rounded border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all focus:outline-none"
                      title="Sửa thông tin"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </button>

                    {/* Nút Xóa (Thùng rác) - LUÔN HIỆN MÀU ĐỎ */}
                    <button
                      onClick={() => {
                        setLeadToDelete(item);
                        setIsDeleteModalOpen(true);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 transition-all focus:outline-none"
                      title="Xóa khách hàng"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal xác nhận xóa */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Xác nhận xóa">
        <p>Bạn chắc chắn muốn xóa khách hàng <strong>{leadToDelete?.name}</strong>?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Hủy</Button>
          <Button className="bg-red-600 text-white" onClick={confirmDelete}>Xác nhận xóa</Button>
        </div>
      </Modal>

      {/* Phân trang đồng nhất */}
      {!isLoading && leads.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};