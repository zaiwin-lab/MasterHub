import { CheckCircle2, FileText } from 'lucide-react';
import { useI18n } from '../lib/i18n/context';

/** A static sample so Committee members can see the output format up front. */
export default function ReportPreview() {
  const { t } = useI18n();
  const rows: [string, number][] = [
    [t.criteria.relevance.label, 90],
    [t.criteria.benefit.label, 90],
    [t.criteria.provider.label, 80],
    [t.criteria.budget.label, 85],
    [t.criteria.readiness.label, 90],
  ];

  return (
    <section id="report-preview" className="no-print scroll-mt-20 bg-white py-14">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="section-tag">{t.reportPreview.tag}</span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
              {t.reportPreview.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">{t.reportPreview.desc}</p>
            <ul className="mt-5 space-y-2.5">
              {t.reportPreview.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink/70">
                  <CheckCircle2 size={16} className="mt-0.5 flex-none text-teal-600" />
                  {item}
                </li>
              ))}
            </ul>
            <a href="#assessment" className="btn-primary mt-7">
              {t.reportPreview.cta}
            </a>
          </div>

          {/* Sample report card */}
          <div className="card p-6">
            <div className="flex items-center gap-2 border-b border-navy-50 pb-3">
              <FileText size={15} className="text-gold-600" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gold-600">
                {t.reportPreview.sampleTag}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-navy-900">{t.reportPreview.sampleTitle}</p>
                <p className="text-xs text-ink/50">{t.reportPreview.sampleOrg}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-navy-900">87%</p>
                <p className="text-[11px] font-bold text-teal-700">{t.reportPreview.sampleStatus}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {rows.map(([label, pct]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="w-44 flex-none truncate text-xs text-ink/60">{label}</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-navy-100">
                    <span
                      className="block h-full rounded-full bg-teal-600"
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-lg bg-navy-50/60 px-3.5 py-2.5 text-xs leading-relaxed text-ink/60">
              <span className="font-semibold text-navy-800">{t.reportPreview.nextActionLabel}</span>{' '}
              {t.reportPreview.sampleNextAction}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
