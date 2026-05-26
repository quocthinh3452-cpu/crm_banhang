import React, { useState, useEffect } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { Lead, leadApi, LeadLog } from '../services/leadApi';
import { lookupApi, LookupItem } from '../services/lookupApi';

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ isOpen, onClose, lead }) => {
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  const [provinces, setProvinces] = useState<LookupItem[]>([]);
  const [sources, setSources] = useState<LookupItem[]>([]);
  const [salesGroups, setSalesGroups] = useState<LookupItem[]>([]);

  const [logs, setLogs] = useState<LeadLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [actionType, setActionType] = useState('CALL');
  const [newNote, setNewNote] = useState('');
  const [submittingLog, setSubmittingLog] = useState(false);

  // STATE DÀNH CHO VIỆC SỬA LOG
  const [editingLogId, setEditingLogId] = useState<number | null>(null);
  const [editActionType, setEditActionType] = useState('CALL');
  const [editNote, setEditNote] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowSensitiveData(false);
      setNewNote('');
      setActionType('CALL');
      setEditingLogId(null);
    } else {
      lookupApi.getProvinces().then(setProvinces).catch(() => setProvinces([]));
      lookupApi.getSources().then(setSources).catch(() => setSources([]));
      lookupApi.getSalesGroups().then(setSalesGroups).catch(() => setSalesGroups([]));
    }
  }, [isOpen]);

  const loadLogs = async () => {
    if (!lead?.id) return;
    setLoadingLogs(true);
    try {
      const data = await leadApi.getLeadLogs(lead.id);
      setLogs(data || []);
    } catch (error) {
      console.error("Không thể lấy lịch sử tương tác:", error);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (isOpen && lead?.id) {
      loadLogs();
    }
  }, [isOpen, lead]);

  if (!lead) return null;

  const safeProvinceId = lead.provinceId ?? (lead as any).province_id;
  const safeSourceId = lead.sourceId ?? (lead as any).source_id;
  const safeSalesGroupId = lead.salesGroupId ?? (lead as any).sales_group_id;

  const maskData = (data?: string) => {
    if (!data) return 'Chưa cập nhật';
    if (showSensitiveData) return data;
    if (data.length > 4) return '*'.repeat(data.length - 4) + data.slice(-4);
    return '***';
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'NEW': 'Mới nhận', 'CONTACTING': 'Đang liên hệ',
      'CONVERTED': 'Đã chuyển đổi', 'DROPPED': 'Ngừng chăm sóc',
      'new_lead': 'Mới nhận', 'contacting': 'Đang liên hệ',
      'converted': 'Đã chuyển đổi', 'dropped': 'Ngừng chăm sóc'
    };
    return statusMap[status] || status;
  };

  const getLookupName = (list: LookupItem[], id: any): string => {
    if (id === undefined || id === null || id === '') return 'Chưa cập nhật';
    const item = list.find(i => String(i.id) === String(id));
    return item ? item.name : 'Chưa cập nhật';
  };

  // --- HÀM THÊM MỚI LOG ---
  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead.id || !newNote.trim()) return;

    setSubmittingLog(true);
    try {
      await leadApi.createLeadLog(lead.id, { action: actionType, note: newNote.trim() });
      setNewNote('');
      loadLogs();
    } catch (error) {
      console.error("Lỗi khi lưu vết tương tác:", error);
    } finally {
      setSubmittingLog(false);
    }
  };

  // --- HÀM XÓA LOG ---
  const handleDeleteLog = async (logId: number) => {
    if (!lead.id) return;
    if (!window.confirm('Bạn có chắc chắn muốn xóa lịch sử tương tác này không?')) return;
    
    try {
      await leadApi.deleteLeadLog(lead.id, logId);
      loadLogs(); // Load lại bảng sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa log:", error);
      alert("Lỗi khi xóa! Vui lòng thử lại.");
    }
  };

  // --- HÀM MỞ FORM SỬA LOG ---
  const handleStartEdit = (log: LeadLog) => {
    setEditingLogId(log.id!);
    setEditActionType((log.action || 'CALL').toUpperCase());
    setEditNote(log.note);
  };

  // --- HÀM LƯU LẠI SAU KHI SỬA ---
  const handleSaveEdit = async (logId: number) => {
    if (!lead.id || !editNote.trim()) return;
    setSavingEdit(true);
    try {
      await leadApi.updateLeadLog(lead.id, logId, { action: editActionType, note: editNote.trim() });
      setEditingLogId(null); // Tắt form sửa
      loadLogs(); // Load lại data mới
    } catch (error) {
      console.error("Lỗi khi cập nhật log:", error);
      alert("Lỗi khi cập nhật! Vui lòng thử lại.");
    } finally {
      setSavingEdit(false);
    }
  };

  const getActionDisplay = (action?: string) => {
    const safeAction = (action || '').toUpperCase(); 
    switch (safeAction) {
      case 'CALL': return { icon: '📞', text: 'Gọi điện' };
      case 'MEETING': return { icon: '🤝', text: 'Gặp mặt' };
      case 'EMAIL': return { icon: '✉️', text: 'Gửi Email' };
      default: return { icon: '📝', text: 'Ghi chú khác' };
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết Khách hàng tiềm năng" maxWidth="max-w-6xl">
      <div className="flex flex-col max-h-[85vh]">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto pr-2 pb-4 items-start">
          
          {/* CỘT TRÁI (Giữ nguyên) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Thẻ 1 */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 text-base border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">👤 Thông tin cơ bản</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
                <div><span className="text-gray-500 text-xs block mb-1">Họ và tên</span> <span className="font-medium text-gray-900">{lead.name}</span></div>
                <div><span className="text-gray-500 text-xs block mb-1">Tên công ty</span> <span className="font-medium text-gray-900">{lead.company || 'Không có'}</span></div>
                <div><span className="text-gray-500 text-xs block mb-1">Số điện thoại</span> <span className="font-medium text-blue-600">{lead.phone || 'Chưa cập nhật'}</span></div>
                <div><span className="text-gray-500 text-xs block mb-1">Email</span> <span className="font-medium text-gray-900">{lead.email || 'Chưa cập nhật'}</span></div>
                <div><span className="text-gray-500 text-xs block mb-1">Khu vực</span> <span className="font-medium text-gray-900">{getLookupName(provinces, safeProvinceId)}</span></div>
                <div><span className="text-gray-500 text-xs block mb-1">Nguồn khách</span> <span className="font-medium text-gray-900">{getLookupName(sources, safeSourceId)}</span></div>
                <div className="col-span-2"><span className="text-gray-500 text-xs block mb-1">Nhân viên phụ trách</span> <span className="font-medium text-purple-600">{getLookupName(salesGroups, safeSalesGroupId)}</span></div>
              </div>
            </div>

            {/* Thẻ 2 */}
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 text-base border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">💼 Thông tin nghiệp vụ</h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-4 text-sm">
                <div><span className="text-gray-500 text-xs block mb-1">Trạng thái</span> <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-md text-xs font-semibold">{getStatusText(lead.status)}</span></div>
                <div><span className="text-gray-500 text-xs block mb-1">Doanh số dự kiến</span> <span className="font-semibold text-green-600 text-base">{lead.expectedRevenue ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(lead.expectedRevenue) : '0 ₫'}</span></div>
                <div className="col-span-2"><span className="text-gray-500 text-xs block mb-1">Sản phẩm quan tâm</span> <span className="font-medium text-gray-900">{lead.serviceInterest || 'Chưa xác định'}</span></div>
                <div className="col-span-2"><span className="text-gray-500 text-xs block mb-1">Ghi chú ban đầu</span> <div className="bg-gray-50 p-3 rounded-md border border-gray-100 text-gray-700 italic text-sm">{lead.note || 'Không có ghi chú'}</div></div>
              </div>
            </div>

            {/* Thẻ 3 */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                <h3 className="font-semibold text-gray-800 text-base">🔐 Thông tin định danh</h3>
                <button onClick={() => setShowSensitiveData(!showSensitiveData)} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium bg-blue-100/50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors">{showSensitiveData ? '👁️ Ẩn thông tin' : '🙈 Hiện thông tin'}</button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500 text-xs block mb-1">Mã số thuế</span> <span className="font-mono font-semibold text-red-600 tracking-wider">{maskData(lead.taxCode)}</span></div>
                <div><span className="text-gray-500 text-xs block mb-1">Số CCCD</span> <span className="font-mono font-semibold text-red-600 tracking-wider">{maskData(lead.idCard)}</span></div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI - TIMELINE */}
          <div className="lg:col-span-5 bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col h-full min-h-[500px]">
            <h3 className="font-semibold text-gray-800 text-base border-b border-gray-200 pb-3 mb-4 flex items-center gap-2">📜 Lịch sử tương tác</h3>

            <form onSubmit={handleAddLog} className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm mb-6 shrink-0">
              <div className="flex gap-3 items-center mb-3">
                <span className="text-sm text-gray-600 font-medium whitespace-nowrap">Hình thức:</span>
                <select value={actionType} onChange={(e) => setActionType(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option value="CALL">📞 Gọi điện</option>
                  <option value="MEETING">🤝 Gặp mặt</option>
                  <option value="EMAIL">✉️ Gửi Email</option>
                  <option value="OTHER">📝 Khác</option>
                </select>
              </div>
              <textarea placeholder="Nội dung trao đổi với khách hàng..." rows={2} value={newNote} onChange={(e) => setNewNote(e.target.value)} className="w-full text-sm p-3 border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none mb-3" required />
              <div className="flex justify-end">
                <button type="submit" disabled={submittingLog} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-md transition-colors disabled:bg-gray-400 flex items-center gap-2">{submittingLog ? 'Đang lưu...' : 'Ghi nhận'}</button>
              </div>
            </form>

            {/* Danh sách Timeline */}
            <div className="flex-1 overflow-y-auto pr-2">
              {loadingLogs ? (
                <div className="text-center text-sm text-gray-500 py-8">Đang tải lịch sử...</div>
              ) : logs.length === 0 ? (
                <div className="text-center text-sm text-gray-400 py-10 italic bg-white border border-dashed border-gray-300 rounded-lg">Chưa có lịch sử chăm sóc.</div>
              ) : (
                <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pb-4">
                  {logs.map((log) => (
                    <div key={log.id} className="relative pl-6">
                      <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-blue-500" />
                      
                      {/* KHỐI HIỂN THỊ LOG (Có hiệu ứng Hover hiện nút) */}
                      {editingLogId === log.id ? (
                        // Giao diện khi bấm vào nút Sửa
                        <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg shadow-sm">
                          <select value={editActionType} onChange={(e) => setEditActionType(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-blue-500 mb-2">
                            <option value="CALL">📞 Gọi điện</option>
                            <option value="MEETING">🤝 Gặp mặt</option>
                            <option value="EMAIL">✉️ Gửi Email</option>
                            <option value="OTHER">📝 Khác</option>
                          </select>
                          <textarea value={editNote} onChange={(e) => setEditNote(e.target.value)} rows={3} className="w-full text-sm p-3 border border-gray-300 rounded-md outline-none focus:border-blue-500 resize-none mb-2" required />
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingLogId(null)} className="text-gray-500 hover:text-gray-700 text-xs font-medium px-3 py-1">Hủy</button>
                            <button onClick={() => handleSaveEdit(log.id!)} disabled={savingEdit} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-1.5 rounded disabled:bg-gray-400">{savingEdit ? 'Đang lưu...' : 'Lưu lại'}</button>
                          </div>
                        </div>
                      ) : (
                        // Giao diện hiển thị bình thường (nhóm class 'group' để bắt sự kiện hover)
                        <div className="group bg-white p-4 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all relative">
                          
                          {/* Nút Sửa / Xóa ẩn đi, chỉ hiện khi hover */}
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white pl-2">
                            <button onClick={() => handleStartEdit(log)} className="text-gray-400 hover:text-blue-600" title="Sửa">✏️</button>
                            <button onClick={() => handleDeleteLog(log.id!)} className="text-gray-400 hover:text-red-600" title="Xóa">🗑️</button>
                          </div>

                          <div className="flex justify-between items-start mb-2 pr-12">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-gray-800 text-sm">
                              {getActionDisplay(log.action).icon} {getActionDisplay(log.action).text}
                            </span>
                            <span className="text-[11px] text-gray-400 font-medium">
                              {log.createdAt ? new Date(log.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{log.note}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200 mt-2 shrink-0">
          <Button variant="secondary" onClick={onClose} className="px-6">Đóng lại</Button>
        </div>

      </div>
    </Modal>
  );
};