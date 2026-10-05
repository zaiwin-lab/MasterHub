import Image from 'next/image';
import { site } from '@/content/site';
import { AMOUNTS, formatRM } from '@/lib/rules';
import { ContributionForm } from './components/ContributionForm';
import { SiteFooter } from './components/SiteFooter';
import { SiteHeader } from './components/SiteHeader';
import { ArrowRight, ArrowUpRight } from './components/icons';
import heroImage from '@/public/images/kuching-waterfront.jpg';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

export default function Home() {
  const c = site.commitment;
  return (
    <>
      <SiteHeader />
      <main id="main">
        {/* Hero */}
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-media">
            <Image src={heroImage} alt={site.hero.imageAlt} priority fill sizes="100vw" placeholder="blur" />
          </div>
          <div className="wrap hero-content">
            <p className="hero-chapter">
              {site.formalName}
            </p>
            <h1 id="hero-title">{site.tagline}</h1>
            <p className="hero-lede" lang="ms">
              {site.supportingLine}
            </p>
            <div className="hero-actions">
              <a href="#contribute" className="btn btn-light">
                Sumbang / Buat Bayaran
                <ArrowRight />
              </a>
              <a href="#corporate" className="btn btn-outline-light">
                Corporate Contribution
              </a>
            </div>
            <div className="hero-links">
              <a href={site.links.uthm} {...ext}>
                Official UTHM
                <ArrowUpRight />
              </a>
              <a href={site.links.pkka} {...ext}>
                Career &amp; Alumni – PKKA
                <ArrowUpRight />
              </a>
            </div>
          </div>
          <p className="hero-credit">{site.hero.imageCredit}</p>
        </section>

        {/* About + focus */}
        <section className="section" id="about" aria-labelledby="about-title">
          <div className="wrap">
            <div className="split">
              <h2 className="section-title" id="about-title">
                About Alumni UTHM Borneo
              </h2>
              <div className="prose">
                {site.about.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>
            <div className="focus">
              <h3 className="focus-title">Our Focus</h3>
              <ul className="focus-list">
                {site.focus.map((f) => (
                  <li key={f.title}>
                    <h4>{f.title}</h4>
                    <p>{f.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Commitment */}
        <section className="section commitment" id="commitment" aria-labelledby="commitment-title">
          <div className="wrap commitment-grid">
            <div>
              <h2 className="section-title" id="commitment-title">
                {c.title}
              </h2>
              <p className="commitment-text">{c.text}</p>
              <a href={site.links.highlight} className="btn btn-outline-light" {...ext}>
                View Official UTHM Highlight
                <ArrowUpRight />
              </a>
            </div>
            <div>
              <dl className="figures">
                <div className="figure-lead">
                  <dt>{c.lead.label}</dt>
                  <dd>{c.lead.value}</dd>
                </div>
                {c.items.map((item) => (
                  <div className="figure-row" key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
              {c.note && <p className="figure-note">{c.note}</p>}
            </div>
          </div>
        </section>

        {/* Contribution */}
        <section className="section contribute" id="contribute" aria-labelledby="contribute-title">
          <div className="wrap contribute-grid">
            <div className="contribute-intro">
              <h2 className="section-title" id="contribute-title">
                Support Our Alumni Community
              </h2>
              <p className="contribute-lede">
                Choose an amount, add a message if you wish, and pay securely online. Your receipt is emailed to you as
                soon as the payment is confirmed.
              </p>
            </div>
            <ContributionForm
              paymentMethods={
                process.env.TOYYIBPAY_DUITNOW_QR === '1' ? 'Online banking (FPX) or DuitNow QR' : 'Online banking (FPX)'
              }
            />
            <div className="option-notes">
              <div className="option-note">
                <h3>
                  Alumni &amp; individuals <span>{AMOUNTS.individual.presets.map((a) => formatRM(a)).join(' · ')}</span>
                </h3>
                <p>
                  Support alumni programmes, welfare, graduate development and the endowment initiative, or pay for an
                  alumni programme or event.
                </p>
              </div>
              <div className="option-note" id="recognition">
                <h3>
                  Corporate &amp; industry partners <span>From {formatRM(AMOUNTS.corporate.min)}</span>
                </h3>
                <p>
                  Corporate organisations, industry partners and friends of UTHM are invited to support selected Alumni
                  UTHM Zon Borneo initiatives. Potential recognition may include:
                </p>
                <ul>
                  <li>Contributor acknowledgement</li>
                  <li>Corporate supporter recognition</li>
                  <li>Recognition in selected alumni programmes or communications</li>
                  <li>
                    Eligible approved contributions may receive an appreciation letter and/or plaque through the
                    relevant UTHM office
                  </li>
                </ul>
                <p className="fineprint">Recognition is subject to eligibility and approval.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Official links */}
        <section className="section" id="official" aria-labelledby="official-title">
          <div className="wrap split">
            <div>
              <h2 className="section-title" id="official-title">
                Official UTHM Links
              </h2>
              <p className="official-note">
                Official university alumni and career services are provided by UTHM through the Career &amp; Alumni
                Centre (PKKA). This portal is a regional chapter initiative and does not replace any official UTHM
                system.
              </p>
            </div>
            <ul className="official-list">
              <li>
                <a href={site.links.uthm} {...ext}>
                  <span className="official-name">UTHM Official Website</span>
                  <span className="official-meta">uthm.edu.my</span>
                  <ArrowUpRight />
                </a>
              </li>
              <li>
                <a href={site.links.pkka} {...ext}>
                  <span className="official-name">Career &amp; Alumni – PKKA</span>
                  <span className="official-meta">pkka.uthm.edu.my · official alumni and career services</span>
                  <ArrowUpRight />
                </a>
              </li>
              <li>
                <a href={site.links.highlight} {...ext}>
                  <span className="official-name">Official UTHM Highlight</span>
                  <span className="official-meta">UTHM on Facebook</span>
                  <ArrowUpRight />
                </a>
              </li>
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
