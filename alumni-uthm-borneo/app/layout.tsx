import type { Metadata, Viewport } from 'next';
import { Schibsted_Grotesk } from 'next/font/google';
import { site } from '@/content/site';
import './globals.css';

const schibsted = Schibsted_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-schibsted',
  display: 'swap',
});

const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: `${site.brand} · ${site.chapter}`,
  description: `${site.tagline} ${site.description}`,
  openGraph: {
    title: `${site.brand} · ${site.chapter}`,
    description: site.tagline,
    images: [{ url: site.hero.image, width: 2000, height: 1333, alt: site.hero.imageAlt }],
    locale: 'en_MY',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f2445',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-MY" className={schibsted.variable}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
