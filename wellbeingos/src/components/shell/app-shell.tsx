'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, Wallet, Receipt, Stethoscope, HeartPulse, CalendarDays, ClipboardList, BarChart3,
  Radar, Inbox, Users, FileText, Leaf, Lock, Settings, History, Menu, X, Bell, LogOut, RefreshCw,
} from 'lucide-react';
import { useStore } from '@/core/data/store';
import { canAny, roleLabels } from '@/core/access/permissions';
import { groupLabels, navigation, type NavItem } from '@/core/config/navigation';
import { notificationsFor } from '@/core/data/repository';
import { BrandMark } from './brand';
import { ModeToggle, TenantTheme } from './theme';
import { Badge, Button, Skeleton } from '@/components/ui/primitives';
import { cn, initials, relativeTime } from '@/lib/utils';

const icons: Record<string, typeof Home> = {
  home: Home, wallet: Wallet, receipt: Receipt, stethoscope: Stethoscope, heart: HeartPulse,
  calendar: CalendarDays, clipboard: ClipboardList, chart: BarChart3, radar: Radar, inbox: Inbox,
  users: Users, file: FileText, leaf: Leaf, lock: Lock, settings: Settings, history: History,
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const { ready, config, session, db, signOut, mode, setMode } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  useEffect(() => {
    if (ready && !session) router.replace('/');
  }, [ready, session, router]);

  useEffect(() => {
    setMobileOpen(false);
    setNotifyOpen(false);
  }, [pathname]);

  const items = useMemo(() => {
    if (!session) return [];
    return navigation.filter((item) => {
      if (item.module && !config.modules[item.module]) return false;
      if (item.capabilities.length === 0) return true;
      return canAny(session, item.capabilities);
    });
  }, [session, config.modules]);

  if (!ready || !session) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-6">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const notifications = notificationsFor(db, session);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen">
      <TenantTheme config={config} mode={mode} />

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-line bg-surface/95 px-4 py-3 backdrop-blur lg:hidden no-print">
        <button onClick={() => setMobileOpen(true)} aria-label="Open navigation" className="rounded-lg p-2 text-ink-muted hover:bg-tint/[0.06]">
          <Menu size={20} />
        </button>
        <BrandMark mark={config.logoMark} productName={config.productName} size="sm" />
        <div className="flex items-center gap-1">
          <ModeToggle mode={mode} onChange={setMode} />
          <NotifyButton unread={unread} onClick={() => setNotifyOpen((v) => !v)} />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1500px]">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-[268px] shrink-0 overflow-y-auto border-r border-line bg-surface/95 backdrop-blur-xl transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 no-print',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex items-center justify-between px-5 py-5">
            <BrandMark mark={config.logoMark} productName={config.productName} organisation={config.shortName} />
            <button onClick={() => setMobileOpen(false)} className="rounded-lg p-1.5 text-ink-muted hover:bg-tint/[0.06] lg:hidden" aria-label="Close navigation">
              <X size={18} />
            </button>
          </div>

          <nav className="px-3 pb-6">
            {(['main', 'manage', 'account'] as NavItem['group'][]).map((group) => {
              const groupItems = items.filter((i) => i.group === group);
              if (!groupItems.length) return null;
              return (
                <div key={group} className="mb-5">
                  <p className="label px-3 pb-1.5">{groupLabels[group]}</p>
                  <ul className="space-y-0.5">
                    {groupItems.map((item) => {
                      const Icon = icons[item.icon] ?? Home;
                      const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                      return (
                        <li key={item.key}>
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition-colors',
                              active
                                ? 'bg-gradient-to-r from-brand/[0.18] via-brand/[0.08] to-transparent font-medium text-head shadow-[inset_0_0_0_1px_rgb(var(--c-brand)/0.3)]'
                                : 'text-ink-muted hover:bg-tint/[0.05] hover:text-head',
                            )}
                            aria-current={active ? 'page' : undefined}
                          >
                            {active ? (
                              <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-brand shadow-[0_0_12px_1px_rgb(var(--c-brand)/0.8)]" aria-hidden />
                            ) : null}
                            <Icon size={17} strokeWidth={active ? 2.2 : 1.9} className={active ? 'shrink-0 text-brand' : 'shrink-0'} aria-hidden />
                            <span className="truncate">{item.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </nav>

          <div className="sticky bottom-0 border-t border-line bg-surface px-4 py-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-brand/30 bg-brand/12 text-[12px] font-semibold text-brand">
                {initials(session.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-ink">{session.name}</p>
                <p className="truncate text-[11.5px] text-ink-muted">{session.roles.map((r) => roleLabels[r]).join(' · ')}</p>
              </div>
              <button onClick={signOut} className="rounded-lg p-2 text-ink-soft hover:bg-tint/[0.06] hover:text-ink" aria-label="Sign out" title="Sign out">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-40 bg-canvas/80 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden />
        ) : null}

        {/* Main column */}
        <div className="min-w-0 flex-1">
          <div className="sticky top-0 z-30 hidden items-center justify-between gap-4 border-b border-line bg-canvas/70 px-6 py-3 backdrop-blur-xl lg:flex no-print">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-2 rounded-full border border-brand/25 bg-brand/[0.08] px-3 py-1 text-[11.5px] font-medium text-brand">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand shadow-[0_0_8px_1px_rgb(var(--c-brand)/0.9)]" />
                Live
              </span>
              <Badge tone="muted">{config.organisationCode}</Badge>
              <span className="hidden text-[13px] text-ink-muted xl:inline">{config.tagline}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="accent">Benefit period {db.periodYear}</Badge>
              <ModeToggle mode={mode} onChange={setMode} />
              <NotifyButton unread={unread} onClick={() => setNotifyOpen((v) => !v)} />
            </div>
          </div>

          {notifyOpen ? (
            <NotificationPanel onClose={() => setNotifyOpen(false)} />
          ) : null}

          <main className="px-4 pb-16 pt-5 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

function NotifyButton({ unread, onClick }: { unread: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="relative rounded-lg p-2 text-ink-muted hover:bg-tint/[0.06] hover:text-ink" aria-label={`Notifications, ${unread} unread`}>
      <Bell size={19} />
      {unread > 0 ? (
        <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-risk px-1 text-[10px] font-semibold text-white">
          {unread}
        </span>
      ) : null}
    </button>
  );
}

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { db, session, actions, resetDemoData } = useStore();
  if (!session) return null;
  const notifications = notificationsFor(db, session);

  return (
    <div className="border-b border-line bg-surface px-4 py-4 sm:px-6 no-print">
      <div className="mx-auto max-w-3xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-head">Notifications</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="quiet" onClick={actions.markNotificationsRead}>Mark all read</Button>
            <Button size="sm" variant="quiet" onClick={onClose}>Close</Button>
          </div>
        </div>
        {notifications.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-[13px] text-ink-muted">
            Nothing needs your attention right now.
          </p>
        ) : (
          <ul className="space-y-2">
            {notifications.slice(0, 6).map((n) => (
              <li key={n.id} className={cn('rounded-xl border px-4 py-3', n.read ? 'border-line bg-canvas/60' : 'border-brand/25 bg-brand/[0.04]')}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[13.5px] font-medium text-ink">{n.title}</p>
                  <span className="text-[11.5px] text-ink-soft">{relativeTime(n.at)}</span>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">{n.body}</p>
                {n.href ? (
                  <Link href={n.href} className="mt-2 inline-block text-[12.5px] font-medium text-brand hover:underline">Open</Link>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
          <p className="text-[12px] text-ink-soft">Demonstration dataset — fictional data only.</p>
          <Button size="sm" variant="quiet" onClick={resetDemoData}>
            <RefreshCw size={13} /> Reset demo data
          </Button>
        </div>
      </div>
    </div>
  );
}
