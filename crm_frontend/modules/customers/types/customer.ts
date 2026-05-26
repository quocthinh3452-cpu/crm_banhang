export type CustomerType = 'B2B' | 'B2C';

export type CustomerTier = 'SILVER' | 'GOLD' | 'DIAMOND';

export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'BLACKLIST';

export interface Customer {
  id: number;

  name: string;

  email: string;

  phone: string;

  address: string;

  type: CustomerType;

  tier: CustomerTier;

  status: CustomerStatus;

  budget: number;

  note: string;
}