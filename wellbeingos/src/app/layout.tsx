import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StoreProvider } from '@/core/data/store';
import { body, display } from '@/lib/fonts';
import { ThemeRoot } from '@/components/shell/theme';

export const metadata: Metadata = {
  title: 'SEJAHTERA360 — Workforce Wellbeing & Medical Benefit Portal',
  description:
    'Enterprise medical benefit and workforce wellbeing intelligence. Live benefit balances for every employee, organisational insight for leadership, and a privacy architecture that keeps the two apart.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#F2F7F7',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body>
        <StoreProvider>
          <ThemeRoot />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
