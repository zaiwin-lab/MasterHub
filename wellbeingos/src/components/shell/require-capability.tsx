'use client';

import { ShieldOff } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { canAny, type Capability } from '@/core/access/permissions';
import { EmptyState } from '@/components/ui/primitives';

/**
 * Route-level guard.
 *
 * Navigation already hides what a role may not use, but a direct URL must fail
 * closed too — so every page carrying organisational data wraps its content in
 * this guard. The repository layer refuses the same reads independently; this
 * is the second of the two locks, not the only one.
 */
export function RequireCapability({
  capabilities,
  children,
  title = 'Not available for your role',
  description = 'Your role does not include this area. Your own information is available under My Benefit and My Wellbeing.',
}: {
  capabilities: Capability[];
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  const { session } = useStore();
  if (!session) return null;
  if (!canAny(session, capabilities)) {
    return <EmptyState title={title} description={description} icon={<ShieldOff size={26} />} />;
  }
  return <>{children}</>;
}
