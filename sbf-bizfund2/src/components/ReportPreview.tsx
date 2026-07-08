import { CheckCircle2, FileText } from 'lucide-react';

/** A static sample so Committee members can see the output format up front. */
export default function ReportPreview() {
  return (
    <section id="report-preview" className="no-print scroll-mt-20 bg-white py-14">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="section-tag">Report Preview</span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
              An executive-ready summary, every time
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              Each completed assessment produces a consistent, print-ready
              report: overall score, recommendation status, key strengths,
              items requiring clarification, Committee remarks and the
              suggested next action — the same structure for every submission,
              so decisions are transparent and comparable.
            </p>
            <ul className="mt-5 space-y-2.5">
              {[
                'Overall percentage score with recommendation status',
                'Criterion-by-criterion score breakdown',
                'Auto-drafted Committee remarks and next action',
                'One-click print / PDF for meeting papers',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink/70">
                  <CheckCircle2 size={16} className="mt-0.5 flex-none text-teal-600" />
                  {item}
                </li>
              ))}
            </ul>
            <a href="#assessment" className="btn-primary mt-7">
              Run an Assessment
            </a>
          </div>

          {/* Sample report card */}
          <div className="card p-6">
            <div className="flex items-center gap-2 border-b border-navy-50 pb-3">
              <FileText size={15} className="text-gold-600" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-gold-600">
                Sample Assessment Report
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-navy-900">
                  Digital Marketing for Rural SMEs
                </p>
                <p className="text-xs text-ink/50">
                  SME Association of Sarawak (SME Sarawak)
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-navy-900">87%</p>
                <p className="text-[11px] font-bold text-teal-700">Recommended</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {[
                ['Strategic Relevance', 90],
                ['Member Benefit', 90],
                ['Provider Capability', 80],
                ['Budget Reasonableness', 85],
                ['Implementation Readiness', 90],
              ].map(([label, pct]) => (
                <div key={label as string} className="flex items-center gap-3">
                  <span className="w-44 flex-none text-xs text-ink/60">{label}</span>
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
              <span className="font-semibold text-navy-800">Next action:</span>{' '}
              Table for endorsement at the next Committee meeting and proceed to
              funding confirmation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
