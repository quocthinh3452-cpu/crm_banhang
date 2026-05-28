'use client';

import React, {
  useState,
  useEffect,
} from 'react';

import { Plus } from 'lucide-react';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';

import {
  Contact,
  CreateContactInput,
} from '@/modules/customers/domain/types';

import { customerRepository } from '@/modules/customers/data/customerRepository';

import ContactForm from './ContactForm';

import ContactList from './ContactList';

interface Props {
  customerId: string | number;

  contacts: Contact[];
}

export default function ContactsTab({
  customerId,
  contacts: initialContacts,
}: Props) {
  const [
    contacts,
    setContacts,
  ] = useState<Contact[]>(
    initialContacts || []
  );
  useEffect(() => {
  const loadContacts = async () => {
    try {
      const data =
        await customerRepository.getContactsByCustomerId(
          customerId
        );

      setContacts(
      Array.isArray(data)
       ? data
        : data?.data || data?.content || []
    );
    } catch (error) {
      console.error(
        'Load contacts failed',
        error
      );
    }
  };

  if (customerId) {
    loadContacts();
  }
}, [customerId]);  
  const [deleteTarget, setDeleteTarget] = useState<string | number | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    editingContact,
    setEditingContact,
  ] = useState<Contact | null>(
    null
  );

  /**
   * CREATE
   */
  const handleCreate =
    async (
      data: CreateContactInput
    ) => {
      const newContact =
        await customerRepository.createContact(
          data
        );

      setContacts((prev) => [
        newContact,
        ...prev,
      ]);

      setShowForm(false);
    };

  /**
   * EDIT
   */
  const handleEdit =
    (
      contact: Contact
    ) => {
      setEditingContact(
        contact
      );

      setShowForm(true);
    };

  /**
   * UPDATE
   */
  const handleUpdate =
    async (
      data: CreateContactInput
    ) => {
      if (
        !editingContact
      ) {
        return;
      }

      const updated =
        await customerRepository.updateContact(
          editingContact.id,
          {
            id: editingContact.id,
            ...data,
          }
        );

      setContacts((prev) =>
        prev.map((c) =>
          c.id ===
          updated.id
            ? updated
            : c
        )
      );

      setEditingContact(
        null
      );

      setShowForm(false);
    };

  /**
   * DELETE
   */
  const handleDelete =
    async (
      id: string | number
    ) => {
      setDeleteTarget(id);
    };

  const handleDeleteConfirm =
    async () => {
      if (!deleteTarget) {
        return;
      }

      setIsDeleteLoading(true);
      try {
        await customerRepository.deleteContact(
          deleteTarget
        );

        setContacts((prev) =>
          prev.filter(
            (c) =>
              c.id !== deleteTarget
          )
        );
      } finally {
        setIsDeleteLoading(false);
        setDeleteTarget(null);
      }
    };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Người liên hệ
          </h3>

          <p className="text-sm text-slate-400">
            Quản lý danh sách người liên hệ của khách hàng
          </p>
        </div>

        <button
          onClick={() => {
            setEditingContact(
              null
            );

            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={18} />
          Thêm liên hệ
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="p-4 rounded-xl border border-slate-700 bg-slate-900">
          <ContactForm
            customerId={
              customerId
            }
            contact={
              editingContact ||
              undefined
            }
            onSubmit={
              editingContact
                ? handleUpdate
                : handleCreate
            }
            onCancel={() => {
              setShowForm(
                false
              );

              setEditingContact(
                null
              );
            }}
          />
        </div>
      )}

      {/* List */}
      <ContactList
        contacts={contacts}
        onEdit={handleEdit}
        onDelete={
          handleDelete
        }
      />

      <ConfirmDialog
        isOpen={deleteTarget != null}
        title="Xác nhận xóa người liên hệ"
        message="Hành động này sẽ xóa liên hệ vĩnh viễn khỏi hồ sơ khách hàng."
        itemName={deleteTarget ? `Liên hệ #${deleteTarget}` : undefined}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={isDeleteLoading}
      />
    </div>
  );
}