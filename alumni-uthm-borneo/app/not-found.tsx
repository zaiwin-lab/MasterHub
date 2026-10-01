import Link from 'next/link';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';

export default function NotFound() {
  return (
    <>
      <SiteHeader variant="solid" />
      <main id="main" className="wrap doc">
        <h1>Page not found</h1>
        <p>The link may be incomplete or expired.</p>
        <p style={{ marginTop: '2rem' }}>
          <Link className="btn btn-primary" href="/">
            Return Home
          </Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
