'use client';

import React, {
  useState,
} from 'react';

import {
  CreateInteractionInput,
} from '@/modules/customers/domain/types';

interface Props {
  customerId:
    | string
    | number;

  onSubmit: (
    data: CreateInteractionInput
  ) => void;
}

export default function InteractionForm({
  customerId,
  onSubmit,
}: Props) {
  const [
    form,
    setForm,
  ] = useState<
    CreateInteractionInput
  >({
    customerId,

    type: 'Call',

    subject: '',

    content: '',

    interactionDate:
      new Date()
        .toISOString()
        .slice(0, 16),

    status: 'Đã xử lý',
  });

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    onSubmit(form);

    setForm({
      customerId,

      type: 'Call',

      subject: '',

      content: '',

      interactionDate:
        new Date()
          .toISOString()
          .slice(0, 16),

      status: 'Đã xử lý',
    });
  };

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <select
          value={form.type}
          onChange={(e) =>
            setForm({
              ...form,
              type:
                e.target
                  .value as CreateInteractionInput['type'],
            })
          }
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100"
        >
          <option value="Call">
            Call
          </option>

          <option value="Email">
            Email
          </option>

          <option value="Meeting">
            Meeting
          </option>
        </select>

        <input
          type="datetime-local"
          value={
            form.interactionDate
          }
          onChange={(e) =>
            setForm({
              ...form,
              interactionDate:
                e.target.value,
            })
          }
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100"
        />
      </div>

      <input
        type="text"
        placeholder="Tiêu đề"
        value={form.subject}
        onChange={(e) =>
          setForm({
            ...form,
            subject:
              e.target.value,
          })
        }
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100"
      />

      <textarea
        placeholder="Nội dung"
        rows={4}
        value={form.content}
        onChange={(e) =>
          setForm({
            ...form,
            content:
              e.target.value,
          })
        }
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100"
      />

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        Thêm tương tác
      </button>
    </form>
  );
}