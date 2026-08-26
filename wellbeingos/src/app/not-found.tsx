'use client';

import Link from 'next/link';
import { useStore } from '@/core/data/store';
import { Button } from '@/components/ui/primitives';

export default function NotFound() {
  const { session } = useStore();
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-[52px] font-semibold leading-none text-ink-soft/50">404</p>
      <h1 className="mt-4 font-display text-[22px] text-head">This page is not part of the platform</h1>
      <p className="mt-2.5 text-[14px] leading-relaxed text-ink-muted">
        The link may be out of date, or the module may be switched off for your organisation.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href={session ? '/app/overview' : '/'}>
          <Button variant="primary" className="h-11 px-5">{session ? 'Back to your panel' : 'Back to the portal'}</Button>
        </Link>
        <Link href="/#support">
          <Button variant="secondary" className="h-11 px-5">Get support</Button>
        </Link>
      </div>
    </main>
  );
}
