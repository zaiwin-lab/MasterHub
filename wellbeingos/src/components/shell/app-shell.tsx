'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, Wallet, Receipt, Stethoscope, HeartPulse, CalendarDays, ClipboardList, BarChart3,
  Radar, Inbox, Users, FileText, Leaf, Lock, Settings, History, Menu, X, Bell, LogOut,
  RefreshCw, PanelLeftClose, PanelLeftOpen, ChevronRight, Globe2,
} from 'lucide-react';
import { useStore } from '@/core/data/store';
import { canAny, roleLabels } from '@/core/access/permissions';
import { navigation, type NavItem } from '@/core/config/navigation';
import type { RoleKey } from '@/core/domain/types';
import { notificationsFor } from '@/core/data/repository';
import { BrandMark } from './brand';
import { ModeToggle } from './theme';
import { LanguageSelector } from './language-selector';
import { FloatingSupport } from './floating-support';
import { BuildCredit } from './site-footer';
import { Badge, Button, Skeleton } from '@/components/ui/primitives';
import { useT } from '@/lib/use-t';
import type { TranslationKey } from '@/core/i18n';
import { cn, initials, relativeTime } from '@/lib/utils';

const icons: Record<string, typeof Home> = {
  home: Home, wallet: Wallet, receipt: Receipt, stethoscope: Stethoscope, heart: HeartPulse,
  calendar: CalendarDays, clipboard: ClipboardList, chart: BarChart3, radar: Radar, inbox: Inbox,
  users: Users, file: FileText, leaf: Leaf, lock: Lock, settings: Settings, history: History,
};

/** The panel a role signs in to. Naming the destination is what makes the
 *  authenticated area read as a role-based portal rather than one shared app. */
const panelKey: Record<RoleKey, TranslationKey> = {
  employee: 'app.panel.employee',
  management: 'app.panel.management',
  hr: 'app.panel.hr',
  finance: 'app.panel.finance',
  clinic: 'app.panel.clinic',
  wellbeing: 'app.panel.wellbeing',
  admin: 'app.panel.admin',
};

const SIDEBAR_KEY = 'wellbeingos:v1:sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { ready, config, session, db, signOut, mode, setMode } = useStore();
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (ready && !session) router.replace('/signin');
  }, [ready, session, router]);

  useEffect(() => {
    setMobileOpen(false);
    setNotifyOpen(false);
  }, [pathname]);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(SIDEBAR_KEY) === 'collapsed');
    } catch {
      /* storage unavailable — the sidebar simply starts expanded */
    }
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((v) => {
      const next = !v;
      try {
        localStorage.setItem(SIDEBAR_KEY, next ? 'collapsed' : 'expanded');
      } catch {
        /* preference applies for this session only */
      }
      return next;
    });
  }, []);

  const items = useMemo(() => {
    if (!session) return [];
    return navigation.filter((item) => {
      if (item.module && !config.modules[item.module]) return false;
      if (item.capabilities.length === 0) return true;
      return canAny(session, item.capabilities);
    });
  }, [session, config.modules]);

  const current = useMemo(
    () => items.find((i) => pathname === i.href || pathname.startsWith(`${i.href}/`)),
    [items, pathname],
  );

  if (!ready || !session) {
    return (
      <div className="shell space-y-4 py-8">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const notifications = notificationsFor(db, session);
  const unread = notifications.filter((n) => !n.read).length;
  const panel = t(panelKey[session.roles[0]]);

  const sidebar = (
    <SidebarContent
      items={items}
      pathname={pathname}
      collapsed={collapsed}
      panel={panel}
      onNavigate={() => setMobileOpen(false)}
    />
  );

  return (
    <div
      className="min-h-screen"
      style={{ '--app-nav': collapsed ? '76px' : '268px' } as React.CSSProperties}
    >
      {/* ------------------------------------------------ Mobile / tablet bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-line bg-surface/95 px-4 py-3 backdrop-blur lg:hidden no-print">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label={t('nav.openMenu')}
          className="rounded-lg p-2 text-ink-muted hover:bg-tint/[0.06] hover:text-head"
        >
          <Menu size={20} />
        </button>
        <BrandMark mark={config.logoMark} productName={config.productName} size="sm" />
        <div className="flex items-center gap-1">
          <LanguageSelector />
          <NotifyButton unread={unread} label={t('app.notifications')} onClick={() => setNotifyOpen((v) => !v)} />
        </div>
      </header>

      <div className="flex w-full">
        {/* --------------------------------------------------------- Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex shrink-0 flex-col overflow-hidden border-r border-line bg-surface/95 backdrop-blur-xl transition-[transform,width] duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 no-print',
            collapsed ? 'w-[268px] lg:w-[76px]' : 'w-[268px]',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
          aria-label={panel}
        >
          <div className={cn('flex items-center gap-2 px-4 py-5', collapsed ? 'lg:justify-center lg:px-2' : 'justify-between')}>
            <div className={cn('min-w-0', collapsed && 'lg:hidden')}>
              <BrandMark mark={config.logoMark} productName={config.productName} organisation={panel} />
            </div>
            <span
              className={cn(
                'hidden shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand to-violet font-display text-[12.5px] font-semibold text-white',
                collapsed && 'lg:grid lg:h-10 lg:w-10',
              )}
              aria-hidden
            >
              {config.logoMark}
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-1.5 text-ink-muted hover:bg-tint/[0.06] lg:hidden"
              aria-label={t('nav.closeMenu')}
            >
              <X size={18} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">{sidebar}</div>

          {/* Collapse control lives with the navigation it governs. */}
          <button
            onClick={toggleCollapsed}
            aria-label={collapsed ? t('app.expand') : t('app.collapse')}
            title={collapsed ? t('app.expand') : t('app.collapse')}
            className={cn(
              'hidden items-center gap-2.5 border-t border-line px-4 py-3 text-[12.5px] text-ink-muted transition-colors hover:bg-tint/[0.05] hover:text-head lg:flex',
              collapsed && 'lg:justify-center lg:px-2',
            )}
          >
            {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
            <span className={cn(collapsed && 'lg:hidden')}>{t('app.collapse')}</span>
          </button>

          {/* The desktop top bar carries these; on mobile there is no room for
              them beside the brand, so they live at the foot of the drawer. */}
          <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-3 lg:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[12.5px] text-ink-muted transition-colors hover:text-brand"
            >
              <Globe2 size={15} aria-hidden /> {t('app.backToSite')}
            </Link>
            <ModeToggle mode={mode} onChange={setMode} />
          </div>

          <ProfileBlock collapsed={collapsed} name={session.name} roles={session.roles} onSignOut={signOut} signOutLabel={t('app.signOut')} />
        </aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-40 bg-canvas/80 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden />
        ) : null}

        {/* ----------------------------------------------------- Main column */}
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-30 hidden items-center justify-between gap-4 border-b border-line bg-canvas/75 px-6 py-3 backdrop-blur-xl lg:flex xl:px-8 no-print">
            <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[13px]">
              <Link href="/app/overview" className="shrink-0 text-ink-muted transition-colors hover:text-head">
                {panel}
              </Link>
              {current && current.key !== 'overview' ? (
                <>
                  <ChevronRight size={14} className="shrink-0 text-ink-soft" aria-hidden />
                  <span className="truncate font-medium text-head">{t(`navitem.${current.key}` as TranslationKey)}</span>
                </>
              ) : null}
              <span className="ml-2 hidden shrink-0 items-center gap-1.5 rounded-full border border-brand/25 bg-brand/[0.08] px-2.5 py-0.5 text-[11px] font-medium text-brand xl:inline-flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" aria-hidden />
                {t('app.live')}
              </span>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <Badge tone="accent">{t('app.period')} {db.periodYear}</Badge>
              <Link
                href="/"
                className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface/70 text-ink-muted transition-colors hover:border-brand/40 hover:text-brand"
                aria-label={t('app.backToSite')}
                title={t('app.backToSite')}
              >
                <Globe2 size={16} />
              </Link>
              <LanguageSelector />
              <ModeToggle mode={mode} onChange={setMode} />
              <NotifyButton unread={unread} label={t('app.notifications')} onClick={() => setNotifyOpen((v) => !v)} />
            </div>
          </div>

          {notifyOpen ? <NotificationPanel onClose={() => setNotifyOpen(false)} /> : null}

          <main className="flex-1 px-4 pb-24 pt-5 sm:px-6 lg:px-8 xl:px-10">{children}</main>

          <footer className="border-t border-line px-4 py-5 sm:px-6 lg:px-8 xl:px-10 no-print">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
              <p className="text-[12.5px] text-ink-soft">
                © {config.credit.since} {config.productName}. {t('footer.rights')}
              </p>
              <BuildCredit className="text-[12.5px]" />
            </div>
          </footer>
        </div>
      </div>

      <FloatingSupport />
    </div>
  );
}

/* ------------------------------------------------------------- Sidebar body */
function SidebarContent({
  items, pathname, collapsed, panel, onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  collapsed: boolean;
  panel: string;
  onNavigate: () => void;
}) {
  const t = useT();
  const groups: NavItem['group'][] = ['main', 'manage', 'account'];

  return (
    <nav className={cn('pb-4', collapsed ? 'px-2 lg:px-2' : 'px-3')} aria-label={panel}>
      {groups.map((group) => {
        const groupItems = items.filter((i) => i.group === group);
        if (!groupItems.length) return null;
        return (
          <div key={group} className="mb-5">
            <p className={cn('label px-3 pb-1.5', collapsed && 'lg:sr-only')}>{t(`group.${group}` as TranslationKey)}</p>
            <ul className="space-y-0.5">
              {groupItems.map((item) => {
                const Icon = icons[item.icon] ?? Home;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const label = t(`navitem.${item.key}` as TranslationKey);
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      title={collapsed ? label : undefined}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition-colors',
                        collapsed && 'lg:justify-center lg:px-0',
                        active
                          ? 'bg-gradient-to-r from-brand/[0.18] via-brand/[0.08] to-transparent font-medium text-head shadow-[inset_0_0_0_1px_rgb(var(--c-brand)/0.3)]'
                          : 'text-ink-muted hover:bg-tint/[0.05] hover:text-head',
                      )}
                    >
                      {active ? (
                        <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-brand shadow-[0_0_12px_1px_rgb(var(--c-brand)/0.8)]" aria-hidden />
                      ) : null}
                      <Icon size={17} strokeWidth={active ? 2.2 : 1.9} className={cn('shrink-0', active && 'text-brand')} aria-hidden />
                      <span className={cn('truncate', collapsed && 'lg:hidden')}>{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------ Profile block */
function ProfileBlock({
  collapsed, name, roles, onSignOut, signOutLabel,
}: {
  collapsed: boolean;
  name: string;
  roles: RoleKey[];
  onSignOut: () => void;
  signOutLabel: string;
}) {
  return (
    <div className={cn('border-t border-line bg-surface py-4', collapsed ? 'px-2 lg:px-2' : 'px-4')}>
      <div className={cn('flex items-center gap-3', collapsed && 'lg:justify-center')}>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-brand/30 bg-brand/12 text-[12px] font-semibold text-brand" title={name}>
          {initials(name)}
        </span>
        <div className={cn('min-w-0 flex-1', collapsed && 'lg:hidden')}>
          <p className="truncate text-[13px] font-medium text-ink">{name}</p>
          <p className="truncate text-[11.5px] text-ink-muted">{roles.map((r) => roleLabels[r]).join(' · ')}</p>
        </div>
        <button
          onClick={onSignOut}
          className={cn('rounded-lg p-2 text-ink-soft transition-colors hover:bg-risk/10 hover:text-risk', collapsed && 'lg:hidden')}
          aria-label={signOutLabel}
          title={signOutLabel}
        >
          <LogOut size={16} />
        </button>
      </div>
      <button
        onClick={onSignOut}
        className={cn('mt-2 hidden w-full place-items-center rounded-lg p-2 text-ink-soft transition-colors hover:bg-risk/10 hover:text-risk', collapsed && 'lg:grid')}
        aria-label={signOutLabel}
        title={signOutLabel}
      >
        <LogOut size={16} />
      </button>
    </div>
  );
}

function NotifyButton({ unread, label, onClick }: { unread: number; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative rounded-lg p-2 text-ink-muted transition-colors hover:bg-tint/[0.06] hover:text-head"
      aria-label={`${label}, ${unread}`}
    >
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
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!session) return null;
  const notifications = notificationsFor(db, session);

  return (
    <div ref={ref} className="border-b border-line bg-surface px-4 py-4 sm:px-6 lg:px-8 no-print">
      <div className="mx-auto max-w-3xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-head">{t('app.notifications')}</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="quiet" onClick={actions.markNotificationsRead}>{t('app.markRead')}</Button>
            <Button size="sm" variant="quiet" onClick={onClose}>{t('app.close')}</Button>
          </div>
        </div>
        {notifications.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-[13px] text-ink-muted">
            {t('app.noNotifications')}
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
                  <Link href={n.href} className="mt-2 inline-block text-[12.5px] font-medium text-brand hover:underline">
                    {t('app.open')}
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
          <p className="text-[12px] text-ink-soft">{t('app.demoNote')}</p>
          <Button size="sm" variant="quiet" onClick={resetDemoData}>
            <RefreshCw size={13} /> {t('app.resetDemo')}
          </Button>
        </div>
      </div>
    </div>
  );
}
