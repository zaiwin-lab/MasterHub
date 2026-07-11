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
import { FRAMEWORK_CARDS } from '../lib/constants';

const ICONS = [Target, Users, ShieldCheck, Wallet, CalendarCheck, TrendingUp, Scale, Sprout];

export default function Framework() {
  return (
    <section
      id="framework"
      className="no-print scroll-mt-20 border-y border-navy-100 bg-navy-50/40 py-14"
    >
      <div className="mx-auto max-w-6xl px-5">
        <div className="text-center">
          <span className="section-tag">Framework</span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
            BizFund2 Evaluation Framework
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-ink/55">
            Eight dimensions the Committee applies to every programme and
            training submission.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FRAMEWORK_CARDS.map((card, i) => {
            const Icon = ICONS[i];
            return (
              <div key={card.title} className="card p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-navy-800 text-white">
                    <Icon size={17} />
                  </span>
                  <span className="text-[11px] font-bold text-gold-600">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-bold text-navy-900">{card.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink/55">{card.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
