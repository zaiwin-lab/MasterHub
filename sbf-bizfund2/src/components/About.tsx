import { Building2 } from 'lucide-react';
import { useI18n } from '../lib/i18n/context';

export default function About() {
  const { t } = useI18n();
  return (
    <section
      id="about"
      className="no-print scroll-mt-20 border-t border-navy-100 bg-navy-50/40 py-14"
    >
      <div className="mx-auto max-w-3xl px-5 text-center">
        <span className="section-tag mx-auto">
          <Building2 size={13} />
          {t.about.tag}
        </span>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
          {t.about.title}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-ink/65 sm:text-base">{t.about.p1}</p>
        <p className="mt-4 text-sm leading-relaxed text-ink/65 sm:text-base">{t.about.p2}</p>
      </div>
    </section>
  );
}
