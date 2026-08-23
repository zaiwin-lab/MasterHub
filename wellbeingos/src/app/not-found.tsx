import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-[42px] leading-none text-navy">404</p>
      <h1 className="mt-3 font-display text-[20px] text-navy">This page is not part of the platform</h1>
      <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">
        The link may be out of date, or the module may be switched off for your organisation.
      </p>
      <Link href="/app/overview" className="mt-5 inline-flex h-10 items-center rounded-xl bg-navy px-4 text-sm font-medium text-white hover:bg-navy/90">
        Back to your overview
      </Link>
    </main>
  );
}
