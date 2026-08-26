'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, BarChart3, Building2, HeartPulse, ShieldCheck, Stethoscope, Users, Wallet } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { useT } from '@/lib/use-t';
import { roleDescriptions, roleLabels } from '@/core/access/permissions';
import type { RoleKey } from '@/core/domain/types';
import { Modal } from '@/components/ui/primitives';
import { cn, initials } from '@/lib/utils';

const roleIcons: Record<RoleKey, typeof Users> = {
  employee: Wallet,
  management: BarChart3,
  hr: Users,
  finance: Building2,
  clinic: Stethoscope,
  wellbeing: HeartPulse,
  admin: ShieldCheck,
};

/**
 * Demo access lives behind a control rather than on the page.
 *
 * A column of staff names beside a login form reads as a prototype; the same
 * personas one click away read as a demonstration mode of a real portal. The
 * two roles a client actually wants to see are given the space, and the five
 * specialist roles sit underneath at a smaller weight.
 */
const PRIMARY: RoleKey[] = ['employee', 'management'];
const SPECIALIST: RoleKey[] = ['hr', 'finance', 'clinic', 'wellbeing', 'admin'];

export function DemoAccessModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { db, signIn } = useStore();
  const t = useT();
  const router = useRouter();

  const enter = (userId: string) => {
    signIn(userId);
    router.push('/app/overview');
  };

  const usersFor = (role: RoleKey) => db.users.filter((u) => u.roles[0] === role);

  return (
    <Modal open={open} onClose={onClose} title={t('signin.demoTitle')} description={t('signin.demoBody')} wide>
      <p className="label mb-3">{t('signin.demoGroupPrimary')}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {PRIMARY.flatMap((role) =>
          usersFor(role).map((user) => {
            const Icon = roleIcons[role];
            return (
              <button
                key={user.id}
                onClick={() => enter(user.id)}
                className={cn(
                  'group flex min-w-0 flex-col rounded-2xl border p-5 text-left transition-all hover:shadow-lift',
                  role === 'management'
                    ? 'border-violet/30 bg-violet/[0.05] hover:border-violet/55'
                    : 'border-brand/30 bg-brand/[0.05] hover:border-brand/55',
                )}
              >
                <span
                  className={cn(
                    'grid h-11 w-11 place-items-center rounded-xl text-white',
                    role === 'management' ? 'bg-gradient-to-br from-violet to-brand' : 'bg-gradient-to-br from-brand to-violet',
                  )}
                >
                  <Icon size={19} aria-hidden />
                </span>
                <span className="mt-3.5 block font-display text-[16px] font-semibold text-head">{roleLabels[role]}</span>
                <span className="mt-1 block text-[13px] leading-relaxed text-ink-muted">{roleDescriptions[role]}</span>
                <span className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3.5">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line bg-surface text-[10.5px] font-semibold text-head">
                      {initials(user.name)}
                    </span>
                    <span className="truncate text-[12.5px] text-ink-muted">{user.name}</span>
                  </span>
                  <span
                    className={cn(
                      'inline-flex shrink-0 items-center gap-1 text-[12.5px] font-medium',
                      role === 'management' ? 'text-violet' : 'text-brand',
                    )}
                  >
                    {t('signin.enter')} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </span>
              </button>
            );
          }),
        )}
      </div>

      <p className="label mb-3 mt-7">{t('signin.demoGroupSpecialist')}</p>
      <ul className="grid gap-2 sm:grid-cols-2">
        {SPECIALIST.flatMap((role) =>
          usersFor(role).map((user) => {
            const Icon = roleIcons[role];
            return (
              <li key={user.id} className="min-w-0">
                <button
                  onClick={() => enter(user.id)}
                  className="flex w-full items-center gap-3 rounded-xl border border-line bg-raised px-3.5 py-3 text-left transition-colors hover:border-brand/40 hover:bg-brand/[0.06]"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line bg-surface text-ink-muted">
                    <Icon size={15} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium text-head">{roleLabels[role]}</span>
                    <span className="block truncate text-[12px] text-ink-muted">{user.name}</span>
                  </span>
                  <ArrowRight size={15} className="shrink-0 text-ink-soft" aria-hidden />
                </button>
              </li>
            );
          }),
        )}
      </ul>
    </Modal>
  );
}
