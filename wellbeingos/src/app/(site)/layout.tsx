import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/shell/site-footer';
import { FloatingSupport } from '@/components/shell/floating-support';

/**
 * Public chrome. Everything outside /app renders inside this shell so the
 * header, footer and the two assistance controls are guaranteed present on
 * every public page rather than repeated per route.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <FloatingSupport />
    </div>
  );
}
