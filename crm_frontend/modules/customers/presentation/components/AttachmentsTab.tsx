'use client';

import React, { useEffect, useState } from 'react';
import {
  FilePlus,
  Trash2,
  FileText,
  File,
  CalendarDays,
  Paperclip,
} from 'lucide-react';

import {
  Attachment,
  AttachmentType,
  CreateAttachmentInput,
} from '@/modules/customers/domain/types';
import { customerRepository } from '@/modules/customers/data/customerRepository';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import { EmptyState } from '@/shared/components/ui/EmptyState';

interface Props {
  customerId: string | number;
  documents: any[];
}

const ATTACHMENT_TYPES: Record<string, AttachmentType> = {
  pdf: 'PDF',
  docx: 'DOCX',
  xlsx: 'XLSX',
  jpg: 'IMAGE',
  jpeg: 'IMAGE',
  png: 'IMAGE',
  gif: 'IMAGE',
};

const getAttachmentType = (
  fileName: string
): AttachmentType => {
  const ext = fileName
    .split('.')
    .pop()
    ?.toLowerCase();

  if (!ext) {
    return 'OTHER';
  }

  return ATTACHMENT_TYPES[ext] || 'OTHER';
};

const formatSize = (size?: number) => {
  if (!size) return '0 KB';

  if (size >= 1048576) {
    return `${(size / 1048576).toFixed(1)} MB`;
  }

  return `${Math.round(size / 1024)} KB`;
};

export default function AttachmentsTab({
  customerId,
  documents,
}: Props) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | number | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  useEffect(() => {
  setAttachments(documents || []);
}, [documents]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    setLoading(true);

    try {
      const newAttachment: CreateAttachmentInput = {
        customerId,
        fileName: selectedFile.name,
        fileUrl: `https://example.com/files/${selectedFile.name}`,
        fileType: getAttachmentType(
          selectedFile.name
        ),
        fileSize: selectedFile.size,
        uploadedBy: 'Admin',
      };

      const created = await customerRepository.createAttachment(
        newAttachment
      );
      setAttachments((prev) => [created, ...prev]);
      setSelectedFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (
    id: string | number
  ) => {
    setDeleteTarget(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleteLoading(true);
    try {
      await customerRepository.deleteAttachment(deleteTarget);
      setAttachments((prev) =>
        prev.filter((attachment) => attachment.id !== deleteTarget)
      );
    } finally {
      setIsDeleteLoading(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-100">
            Tài liệu đính kèm
          </h3>
          <p className="text-sm text-slate-400">
            Quản lý tải lên và xem tài liệu của khách hàng.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[auto,auto]">
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 cursor-pointer hover:border-slate-500">
            <FilePlus size={18} />
            <span>{selectedFile ? selectedFile.name : 'Chọn tệp'}</span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            <File size={18} />
            Tải lên
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-100">
                  <FileText size={20} />
                  <span className="font-semibold">
                    {attachment.name}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
                  <span className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-1">
                    {attachment.type || 'DOCUMENT'}
                  </span>
                  <span>{attachment.fileUrl || 'Không có file'}</span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={14} />
                    {attachment.createdAt ?? 'N/A'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleDelete(attachment.id)
                }
                className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 hover:text-red-200"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {attachments.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Paperclip}
              title="Không có tài liệu"
              description="Tải lên file mới để lưu thông tin liên quan đến khách hàng."
            />
          </div>
        ) : null}
      </div>

      <ConfirmDialog
        isOpen={deleteTarget != null}
        title="Xác nhận xóa tài liệu"
        message="Hành động này sẽ xóa tài liệu đính kèm vĩnh viễn."
        itemName={deleteTarget ? `Tệp #${deleteTarget}` : undefined}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={isDeleteLoading}
      />
    </div>
  );
}
