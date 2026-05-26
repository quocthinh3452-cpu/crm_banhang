'use client';

import React, { useEffect } from 'react';
import { useDebounce } from '@/shared/hooks/useDebounce';

import {
  CUSTOMER_TYPES,
  CUSTOMER_TIERS,
  CUSTOMER_STATUSES,
} from '@/modules/customers/domain/constants';
import {
  CustomerListParams,
  CustomerStatus,
  CustomerTier,
  CustomerType,
} from '@/modules/customers/domain/types';

interface Props {
  onFilterChange: (
    filters: Partial<CustomerListParams>
  ) => void;
  onReset?: () => void;
  isLoading?: boolean;
}

export default function CustomerFilters({
  onFilterChange,
  onReset,
  isLoading = false,
}: Props) {
  const [search, setSearch] =
    React.useState('');

  const debouncedSearch = useDebounce(search, 250);

  const [type, setType] =
    React.useState<CustomerType | undefined>(
      undefined
    );

  const [tier, setTier] =
    React.useState<CustomerTier | undefined>(
      undefined
    );

  const [status, setStatus] =
    React.useState<CustomerStatus | undefined>(
      undefined
    );

  // Only call onFilterChange when the effective filter values actually change.
  const prevRef = React.useRef<Partial<CustomerListParams> | null>(null);

  React.useEffect(() => {
    const next: Partial<CustomerListParams> = {
      search: debouncedSearch,
      type,
      tier,
      status,
    };

    const prev = prevRef.current;

    const shallowEqual = (a: Partial<CustomerListParams> | null, b: Partial<CustomerListParams>) => {
      if (!a) return false;

      return (
        a.search === b.search &&
        a.type === b.type &&
        a.tier === b.tier &&
        a.status === b.status
      );
    };

    if (!shallowEqual(prev, next)) {
      prevRef.current = next;
      onFilterChange(next);
    }
    // We intentionally include only onFilterChange in deps so change of internal
    // local state triggers evaluation but onFilterChange identity must be stable
    // (memoized by parent) to avoid unnecessary calls.
  }, [debouncedSearch, type, tier, status, onFilterChange]);

  return (
    <div className="bg-slate-800 p-4 rounded-xl mb-6 border border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Tìm kiếm khách hàng..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          disabled={isLoading}
          className="px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white disabled:cursor-not-allowed disabled:opacity-60"
        />

        {/* Type */}
        <select
          value={type ?? ''}
          onChange={(e) =>
            setType(
              e.target.value
                ? (e.target.value as CustomerType)
                : undefined
            )
          }
          className="px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
        >
          <option value="">
            Tất cả loại
          </option>

          {CUSTOMER_TYPES.map(
            (item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            )
          )}
        </select>

        {/* Tier */}
        <select
          value={tier ?? ''}
          onChange={(e) =>
            setTier(
              e.target.value
                ? (e.target.value as CustomerTier)
                : undefined
            )
          }
          className="px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
        >
          <option value="">
            Tất cả hạng
          </option>

          {CUSTOMER_TIERS.map(
            (item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            )
          )}
        </select>

        {/* Status */}
        <select
          value={status ?? ''}
          onChange={(e) =>
            setStatus(
              e.target.value
                ? (e.target.value as CustomerStatus)
                : undefined
            )
          }
          className="px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
        >
          <option value="">
            Tất cả trạng thái
          </option>

          {CUSTOMER_STATUSES.map(
            (item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            )
          )}
        </select>
      </div>
      {onReset && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onReset}
            disabled={isLoading}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Đặt lại
          </button>
        </div>
      )}
    </div>
  );
}