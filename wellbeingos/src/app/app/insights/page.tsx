'use client';

import { useStore } from '@/core/data/store';
import { can } from '@/core/access/permissions';
import { OrganisationDashboard } from '@/components/dashboards/organisation';
import { EmptyState } from '@/components/ui/primitives';

/** Insights reuses the organisational dashboard, shaped by what the role may see. */
export default function InsightsPage() {
  const { session } = useStore();
  if (!session) return null;

  const variant = can(session, 'analytics.financial')
    ? session.roles.includes('finance') ? 'finance' : 'management'
    : session.roles.includes('hr') ? 'hr' : 'management';

  if (!can(session, 'analytics.management') && !can(session, 'analytics.utilisation')) {
    return <EmptyState title="No organisational analytics for this role" description="Your role does not include organisational reporting. Your own information is available under My Benefit and My Wellbeing." />;
  }
  return <OrganisationDashboard variant={variant} />;
}
