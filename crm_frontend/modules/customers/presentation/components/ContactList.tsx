'use client';

import React from 'react';

import {
  Pencil,
  Trash2,
  Star,
  Users,
} from 'lucide-react';
import { EmptyState } from '@/shared/components/ui/EmptyState';

import { Contact } from '@/modules/customers/domain/types';

interface Props {
  contacts: Contact[];

  onEdit: (
    contact: Contact
  ) => void;

  onDelete: (
    id: string | number
  ) => void;
}

export default function ContactList({
  contacts,
  onEdit,
  onDelete,
}: Props) {
  if (
    contacts.length === 0
  ) {
    return (
      <EmptyState
        icon={Users}
        title="Chưa có người liên hệ"
        description="Thêm người liên hệ để lưu thông tin liên hệ khách hàng và ghi nhận nhanh hơn."
      />
    );
  }

  return (
    <div className="space-y-4">
      {contacts.map(
        (contact) => (
          <div
            key={contact.id}
            className="rounded-3xl border border-slate-700 bg-slate-900 p-4 transition hover:border-slate-600 hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-white font-semibold">
                    {
                      contact.fullName
                    }
                  </h4>

                  {contact.isPrimary && (
                    <Star
                      size={16}
                      className="text-yellow-400"
                    />
                  )}
                </div>

                <p className="text-slate-400 text-sm mt-1">
                  {
                    contact.role
                  }
                </p>

                {contact.department && (
                  <p className="text-slate-500 text-sm">
                    {
                      contact.department
                    }
                  </p>
                )}

                <div className="mt-3 space-y-1">
                  {contact.email && (
                    <p className="text-sm text-slate-300">
                      📧{' '}
                      {
                        contact.email
                      }
                    </p>
                  )}

                  {contact.phone && (
                    <p className="text-sm text-slate-300">
                      📞{' '}
                      {
                        contact.phone
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    onEdit(
                      contact
                    )
                  }
                  className="p-2 rounded-lg hover:bg-slate-700 text-slate-300"
                >
                  <Pencil
                    size={18}
                  />
                </button>

                <button
                  onClick={() =>
                    onDelete(
                      contact.id
                    )
                  }
                  className="p-2 rounded-lg hover:bg-red-900/20 text-red-400"
                >
                  <Trash2
                    size={18}
                  />
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}