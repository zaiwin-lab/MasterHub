import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useI18n } from '../lib/i18n/context';

export default function Hero() {
  const { t } = useI18n();
  return (
    <section id="top" className="panel-dark no-print relative overflow-hidden border-b border-white/10">
      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 text-center sm:pt-24">
        <span className="section-tag-dark mx-auto">
          <ShieldCheck size={13} />
          {t.hero.badge}
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          {t.hero.titleA} <span className="text-gold-400">{t.hero.titleB}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
          {t.hero.subtitle}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#assessment"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-950 transition hover:bg-gold-400 sm:w-auto"
          >
            {t.hero.ctaStart}
            <ArrowRight size={16} />
          </a>
          <a
            href="#framework"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
          >
            {t.hero.ctaFramework}
          </a>
        </div>
        <p className="mt-5 text-xs font-medium text-white/40">{t.hero.note}</p>
      </div>
    </section>
  );
}
