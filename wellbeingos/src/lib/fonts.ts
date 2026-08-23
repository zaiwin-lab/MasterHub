import { Space_Grotesk, Inter } from 'next/font/google';

/**
 * Deliberately geometric, not editorial — the sibling deployment in this
 * portfolio uses a serif display face, and these two products must not be
 * mistaken for one another.
 */
export const display = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const body = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
