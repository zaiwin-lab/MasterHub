import type { TenantConfig } from '@/core/config/tenant';
import { stidc } from './stidc';
import { sarawakAgencyB } from './sarawak-agency-b';

export const tenants: Record<string, TenantConfig> = {
  stidc,
  'agency-b': sarawakAgencyB,
};

export const tenantList = Object.values(tenants);

export const defaultTenantId =
  process.env.NEXT_PUBLIC_DEFAULT_TENANT && tenants[process.env.NEXT_PUBLIC_DEFAULT_TENANT]
    ? process.env.NEXT_PUBLIC_DEFAULT_TENANT
    : 'stidc';

export function getTenant(id: string): TenantConfig {
  return tenants[id] ?? tenants[defaultTenantId];
}
