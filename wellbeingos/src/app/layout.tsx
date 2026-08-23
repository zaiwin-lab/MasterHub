import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StoreProvider } from '@/core/data/store';

export const metadata: Metadata = {
  title: 'WellbeingOS',
  description:
    'Enterprise Medical Benefit & Workforce Wellbeing Intelligence Platform. First configured deployment: STIDC SEJAHTERA360.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#12233A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
