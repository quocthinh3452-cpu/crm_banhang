'use client';

import React from 'react';
import { Phone, Mail, Users, Trash2 } from 'lucide-react';
import { TimelineItem } from '@/shared/components/ui/TimelineItem';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { InteractionLog } from '@/modules/customers/domain/types';

interface Props {
  interactions: InteractionLog[];
  onDelete?: (id: string | number) => void;
}

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number }>;

const typeStyles: Record<string, { badge: string; accent: string; icon: IconComponent }> = {
  Call: {
    badge: 'bg-sky-500/15 text-sky-200',
    accent: 'border-sky-600',
    icon: Phone,
  },
  Email: {
    badge: 'bg-emerald-500/15 text-emerald-200',
    accent: 'border-emerald-600',
    icon: Mail,
  },
  Meeting: {
    badge: 'bg-violet-500/15 text-violet-200',
    accent: 'border-violet-600',
    icon: Users,
  },
};

export default function InteractionTimeline({
  interactions,
  onDelete,
}: Props) {
  if (interactions.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Chưa có tương tác nào"
        description="Nếu cần, hãy thêm tương tác đầu tiên để giữ lịch sử khách hàng rõ ràng."
        actionLabel="Thêm tương tác"
        onAction={() => {
          /* to be handled by parent if needed */
        }}
      />
    );
  }

  return (
    <div className="grid gap-4">
      {interactions.map((interaction) => {
        const typeMeta = typeStyles[interaction.type] ?? typeStyles.Call;

        return (
          <TimelineItem
            key={interaction.id}
            icon={typeMeta.icon}
            title={interaction.subject}
            description={interaction.content || 'Không có mô tả chi tiết.'}
            date={interaction.interactionDate}
            author={interaction.createdBy || 'Người dùng'}
            badgeText={interaction.type}
            badgeClass={typeMeta.badge}
            accentClass={`border-l-4 ${typeMeta.accent}`}
          >
            {onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(interaction.id)}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
              >
                <Trash2 size={16} />
                Xóa tương tác
              </button>
            ) : null}
          </TimelineItem>
        );
      })}
    </div>
  );
}
