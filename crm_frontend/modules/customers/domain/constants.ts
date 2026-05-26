export const CUSTOMER_TYPES = [
  {
    value: 'B2B',
    label: 'B2B',
    color: 'bg-blue-500',
  },

  {
    value: 'B2C',
    label: 'B2C',
    color: 'bg-green-500',
  },
];

export const CUSTOMER_TIERS = [
  {
    value: 'Bạc',
    label: 'Bạc',
    color: 'bg-gray-400',
  },

  {
    value: 'Vàng',
    label: 'Vàng',
    color: 'bg-yellow-500',
  },

  {
    value: 'Kim Cương',
    label: 'Kim Cương',
    color: 'bg-cyan-500',
  },
];

export const CUSTOMER_STATUSES = [
  {
    value: 'Đang chăm sóc',
    label: 'Đang chăm sóc',
    color: 'bg-green-500',
  },

  {
    value: 'Ngừng',
    label: 'Ngừng',
    color: 'bg-gray-500',
  },

  {
    value: 'Blacklist',
    label: 'Blacklist',
    color: 'bg-red-500',
  },
  
];
export const CUSTOMER_FORM_VALIDATION = {
  NAME: {
    MIN: 2,
    MAX: 100,
  },
  EMAIL: {
    MAX: 255,
  },
  PHONE: {
    PATTERN: /^[0-9()+\s-]*$/,
  },
  BUDGET: {
    MIN: 0,
    MAX: 999999999,
  },
};

export const PAGINATION_DEFAULTS = {
  page: 1,
  pageSize: 10,
};