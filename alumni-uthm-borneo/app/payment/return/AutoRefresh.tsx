'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/** While a payment is still being confirmed, re-check every few seconds (up to ~2 minutes). */
export function AutoRefresh({ intervalMs = 6000, maxTries = 20 }: { intervalMs?: number; maxTries?: number }) {
  const router = useRouter();
  const [tries, setTries] = useState(0);
  useEffect(() => {
    if (tries >= maxTries) return;
    const t = setTimeout(() => {
      setTries((n) => n + 1);
      router.refresh();
    }, intervalMs);
    return () => clearTimeout(t);
  }, [tries, maxTries, intervalMs, router]);
  return tries >= maxTries ? (
    <p className="status-note">
      This is taking longer than usual. You can safely close this page; if your bank confirms the payment, your receipt
      will still be emailed to you automatically.
    </p>
  ) : null;
}
