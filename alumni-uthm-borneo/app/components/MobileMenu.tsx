'use client';

import { useEffect, useRef } from 'react';

/** <details> menu that closes after a link is chosen, on Escape, or on an outside tap. */
export function MobileMenu({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (e: Event) => {
      const el = ref.current;
      if (!el?.open) return;
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !el.contains(e.target as Node)) el.open = false;
    };
    document.addEventListener('click', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('click', close);
      document.removeEventListener('keydown', close);
    };
  }, []);
  return (
    <details
      ref={ref}
      className="menu"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('a') && ref.current) ref.current.open = false;
      }}
    >
      {children}
    </details>
  );
}
