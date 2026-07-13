import {
  CalendarCheck,
  Scale,
  ShieldCheck,
  Sprout,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { useI18n } from '../lib/i18n/context';

const ICONS = [Target, Users, ShieldCheck, Wallet, CalendarCheck, TrendingUp, Scale, Sprout];

export default function Framework() {
  const { t } = useI18n();
  return (
    <section
      id="framework"
      className="panel-dark no-print scroll-mt-20 border-y border-white/10 py-16"
    >
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <span className="section-tag-dark">{t.framework.tag}</span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {t.framework.title}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/55">{t.framework.subtitle}</p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.framework.cards.map((card, i) => {
            const Icon = ICONS[i];
            return (
              <div key={card.title} className="card-dark p-5 transition hover:bg-white/[0.07]">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gold-500 text-navy-950">
                    <Icon size={17} />
                  </span>
                  <span className="text-[11px] font-bold text-gold-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-bold text-white">{card.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-white/55">{card.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
