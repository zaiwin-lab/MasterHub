'use client';

import Link from 'next/link';
import { useStore } from '@/core/data/store';
import { EmployeeDashboard } from '@/components/dashboards/employee';
import { OrganisationDashboard } from '@/components/dashboards/organisation';
import { WellbeingDashboard } from '@/components/dashboards/wellbeing';
import { AdminDashboard } from '@/components/dashboards/admin';
import { Button, Card, CardBody, CardHeader, Stat } from '@/components/ui/primitives';
import { listTransactions } from '@/core/data/repository';
import { formatMoney } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

/**
 * One route, seven experiences. The role decides which dashboard renders, so a
 * new tenant inherits every role experience without new routing.
 */
export default function OverviewPage() {
  const { session, db, config } = useStore();
  if (!session) return null;
  const role = session.roles[0];

  if (role === 'employee') return <EmployeeDashboard />;
  if (role === 'hr') return <OrganisationDashboard variant="hr" />;
  if (role === 'finance') return <OrganisationDashboard variant="finance" />;
  if (role === 'management') return <OrganisationDashboard variant="management" />;
  if (role === 'wellbeing') return <WellbeingDashboard />;
  if (role === 'admin') return <AdminDashboard />;

  // Panel clinic — deliberately the narrowest experience in the platform.
  const submitted = listTransactions(db, session);
  const t = config.terminology;
  const pending = submitted.filter((x) => x.status === 'submitted' || x.status === 'verified');
  const paid = submitted.filter((x) => x.status === 'paid');
  return (
    <div>
      <header className="mb-5">
        <h1 className="font-display text-[22px] leading-tight text-navy sm:text-[26px]">{session.name}</h1>
        <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-ink-muted">
          Verify eligibility, record a visit and track submissions. You see only what this clinic has submitted —
          nothing about a person&apos;s other visits, wellbeing or employment.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Submitted this period" value={`${submitted.length}`} />
        <Stat label="Awaiting decision" value={`${pending.length}`} tone={pending.length > 5 ? 'warn' : undefined} />
        <Stat label="Paid" value={`${paid.length}`} />
        <Stat label="Value submitted" value={formatMoney(submitted.reduce((a, b) => a + b.amount, 0), t.currency, { compact: true })} />
      </div>

      <Card className="mt-4">
        <CardHeader title="Record a visit" subtitle="Start by verifying the person in front of you." />
        <CardBody className="pt-2">
          <Link href="/app/clinic-portal"><Button variant="primary">Open clinic portal <ArrowRight size={15} /></Button></Link>
        </CardBody>
      </Card>
    </div>
  );
}
