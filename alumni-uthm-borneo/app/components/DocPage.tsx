import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

export function DocPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <SiteHeader variant="solid" />
      <main id="main" className="wrap doc">
        <h1>{title}</h1>
        <p className="updated">Last updated {updated}</p>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
