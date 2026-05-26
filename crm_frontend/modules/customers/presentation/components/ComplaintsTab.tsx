'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, ClipboardList } from 'lucide-react';

import {
  Complaint,
  ComplaintPriority,
  ComplaintStatus,
  CreateComplaintInput,
} from '@/modules/customers/domain/types';
import { customerRepository } from '@/modules/customers/data/customerRepository';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { PriorityBadge } from '@/shared/components/ui/PriorityBadge';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';

const statusOptions: ComplaintStatus[] = [
  'Pending',
  'Processing',
  'Resolved',
  'Rejected',
];

const priorityOptions: ComplaintPriority[] = [
  'Low',
  'Medium',
  'High',
  'Critical',
];

export default function ComplaintsTab({
  customerId,
}: {
  customerId: string | number;
}) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Pending' as ComplaintStatus,
    priority: 'Medium' as ComplaintPriority,
  });
  const [deleteTarget, setDeleteTarget] = useState<string | number | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    const loadComplaints = async () => {
      const data = await customerRepository.getComplaintsByCustomer(customerId);
      setComplaints(data);
    };

    loadComplaints();
  }, [customerId]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAdd = async () => {
    if (!form.title.trim()) {
      return;
    }

    const newComplaint: CreateComplaintInput = {
      customerId,
      title: form.title,
      description: form.description,
      status: form.status,
      priority: form.priority,
      createdBy: 'Admin',
    };

    const created = await customerRepository.createComplaint(newComplaint);
    setComplaints((prev) => [created, ...prev]);
    setForm({
      title: '',
      description: '',
      status: 'Pending',
      priority: 'Medium',
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setLoadingDelete(true);
    try {
      await customerRepository.deleteComplaint(deleteTarget);
      setComplaints((prev) => prev.filter((item) => item.id !== deleteTarget));
    } finally {
      setLoadingDelete(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-100">Khiếu nại</h3>
          <p className="text-sm text-slate-400">Theo dõi trạng thái và mức độ ưu tiên của các khiếu nại.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1.5fr,1fr]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tiêu đề khiếu nại</label>
              <input
                value={form.title}
                onChange={(event) => handleChange('title', event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
                placeholder="Nhập tiêu đề"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Mô tả</label>
              <textarea
                value={form.description}
                onChange={(event) => handleChange('description', event.target.value)}
                className="mt-2 min-h-[120px] w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
                placeholder="Mô tả chi tiết"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Trạng thái</label>
              <select
                value={form.status}
                onChange={(event) => handleChange('status', event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Mức độ ưu tiên</label>
              <select
                value={form.priority}
                onChange={(event) => handleChange('priority', event.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-slate-500"
              >
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex items-center gap-2 rounded-3xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-500"
            >
              <Plus size={18} />
              Thêm khiếu nại
            </button>
          </div>
        </div>
      </div>

      {complaints.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Chưa có khiếu nại nào"
          description="Khi khách hàng gửi yêu cầu, bạn sẽ thấy ở đây ngay lập tức."
        />
      ) : (
        <div className="grid gap-4">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-lg font-semibold text-slate-100">{complaint.title}</h4>
                    <StatusBadge status={complaint.status} />
                  </div>
                  <p className="text-slate-400 text-sm leading-6">{complaint.description || 'Không có mô tả'}</p>
                </div>

                <div className="flex flex-col gap-2 text-sm text-slate-400">
                  <div>Ngày tạo: {complaint.createdAt || 'Không rõ'}</div>
                  <div>Người tạo: {complaint.createdBy || 'Admin'}</div>
                  <PriorityBadge priority={complaint.priority} />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-700/60 pt-4 text-slate-400">
                <div className="flex items-center gap-3 text-sm">
                  <span className="rounded-full bg-slate-800 px-3 py-1">#{complaint.id}</span>
                  <span>Khách hàng: {complaint.customerId}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(complaint.id)}
                  className="inline-flex items-center gap-2 rounded-3xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
                >
                  <Trash2 size={16} />
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteTarget != null}
        title="Xác nhận xóa"
        message="Hành động này không thể hoàn tác."
        itemName={deleteTarget ? `Khiếu nại #${deleteTarget}` : undefined}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={loadingDelete}
      />
    </div>
  );
}
