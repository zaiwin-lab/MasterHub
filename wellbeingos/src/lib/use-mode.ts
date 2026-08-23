'use client';

import { useEffect, useState } from 'react';

/**
 * Reads the presentation mode from the document, not from the store, so
 * presentational primitives stay independent of application state. SVG filter
 * attributes take numbers rather than CSS variables, which is why the value
 * has to reach JavaScript at all.
 */
export function usePresentationMode(): 'light' | 'dark' {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const read = () => {
      const value = document.documentElement.dataset.mode;
      setMode(value === 'dark' ? 'dark' : 'light');
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] });
    return () => observer.disconnect();
  }, []);

  return mode;
}
