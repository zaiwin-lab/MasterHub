import Link from 'next/link';
import { site } from '@/content/site';
import { MobileMenu } from './MobileMenu';

const nav = [
  { href: '/#top', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/#contribute', label: 'Contribution' },
  { href: site.links.uthm, label: 'Official UTHM', external: true },
];

export function SiteHeader({ variant = 'overlay' }: { variant?: 'overlay' | 'solid' }) {
  return (
    <header className={`site-header${variant === 'solid' ? ' solid' : ''}`}>
      <div className="wrap header-inner">
        <Link href="/" className="brand" aria-label={`${site.brand}, ${site.chapter}: home`}>
          <span className="brand-name">ALUMNI UTHM BORNEO</span>
          <span className="brand-chapter">{site.chapter}</span>
        </Link>
        <nav aria-label="Main">
          <ul className="nav-links">
            {nav.map((item) => (
              <li key={item.label}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
          <MobileMenu>
            <summary>
              Menu
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 4h10M2 7h10M2 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </summary>
            <div className="menu-panel">
              {nav.map((item) =>
                item.external ? (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.label}
                  </a>
                ) : (
                  <a key={item.label} href={item.href}>
                    {item.label}
                  </a>
                ),
              )}
            </div>
          </MobileMenu>
        </nav>
      </div>
    </header>
  );
}
