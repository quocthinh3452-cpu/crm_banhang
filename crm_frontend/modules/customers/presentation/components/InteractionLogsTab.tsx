'use client';

import React, {
  useState,
} from 'react';

import {
  InteractionLog,
  Contact,
  CreateInteractionInput,
} from '@/modules/customers/domain/types';

import {
  customerRepository,
} from '@/modules/customers/data/customerRepository';

import InteractionForm from './InteractionForm';

import InteractionTimeline from './InteractionTimeline';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';

interface Props {
  customerId:
    | string
    | number;

  interactions: InteractionLog[];

  contacts: Contact[];
}

export default function InteractionLogsTab({
  customerId,
  interactions,
}: Props) {
  const [
    logs,
    setLogs,
  ] = useState(
    interactions
  );
  const [
    deletingId,
    setDeletingId,
  ] = useState<string | number | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleAdd =
    async (
      data: CreateInteractionInput
    ) => {
      const newInteraction =
        await customerRepository.createInteraction(
          data
        );

      setLogs((prev) => [
        newInteraction,
        ...prev,
      ]);
    };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleteLoading(true);

    try {
      await customerRepository.deleteInteraction(deletingId);
      setLogs((prev) => prev.filter((item) => item.id !== deletingId));
    } finally {
      setIsDeleteLoading(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-100 mb-2">
          Lịch sử tương tác
        </h3>

        <p className="text-slate-400 text-sm">
          Quản lý Call,
          Email, Meeting
        </p>
      </div>

      <InteractionForm
        customerId={
          customerId
        }
        onSubmit={
          handleAdd
        }
      />

      <InteractionTimeline
        interactions={logs}
        onDelete={(id) => setDeletingId(id)}
      />

      <ConfirmDialog
        isOpen={deletingId != null}
        title="Xác nhận xóa"
        message="Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa tương tác này?"
        itemName={deletingId ? `ID ${deletingId}` : undefined}
        onCancel={() => setDeletingId(null)}
        onConfirm={handleDelete}
        loading={isDeleteLoading}
      />
    </div>
  );
}