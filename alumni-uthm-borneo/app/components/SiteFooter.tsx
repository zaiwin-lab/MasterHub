import Link from 'next/link';
import { site } from '@/content/site';

export function SiteFooter() {
  const contactHref = site.contactEmail ? `mailto:${site.contactEmail}` : '/terms#contact';
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand-name">ALUMNI UTHM BORNEO</div>
            <div className="brand-chapter">{site.chapter}</div>
            <p className="footer-tagline">{site.tagline}</p>
            <p className="footer-small">{site.description}</p>
          </div>
          <ul className="footer-links" aria-label="Footer">
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/terms">Contribution Terms</Link>
            </li>
            <li>
              <a href={contactHref}>Contact</a>
            </li>
          </ul>
        </div>
        <div className="footer-base">
          <span>Payment and administrative facilitation by {site.facilitator}.</span>
          <span>© {new Date().getFullYear()} {site.formalName}</span>
        </div>
      </div>
    </footer>
  );
}
