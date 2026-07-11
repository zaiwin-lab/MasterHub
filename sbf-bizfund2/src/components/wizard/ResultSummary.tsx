import { AlertTriangle, CheckCircle2, Printer, RotateCcw } from 'lucide-react';
import { CRITERION_KEYS } from '../../lib/constants';
import { buildReport, fillRemarks } from '../../lib/scoring';
import { useI18n } from '../../lib/i18n/context';
import type { OrgDetails, ProgrammeInfo, Scores } from '../../lib/types';

interface Props {
  org: OrgDetails;
  programme: ProgrammeInfo;
  scores: Scores;
  onRestart: () => void;
}

const BAND_STYLES: Record<string, { wrap: string; dot: string; text: string }> = {
  recommended: { wrap: 'border-teal-500 bg-teal-50', dot: 'bg-teal-600', text: 'text-teal-700' },
  clarify: { wrap: 'border-gold-400 bg-gold-50', dot: 'bg-gold-500', text: 'text-gold-700' },
  revise: { wrap: 'border-amber-400 bg-amber-50', dot: 'bg-amber-500', text: 'text-amber-700' },
  reject: { wrap: 'border-red-400 bg-red-50', dot: 'bg-red-500', text: 'text-red-700' },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-navy-50 py-2.5 last:border-0 sm:flex-row sm:gap-4">
      <dt className="w-56 flex-none text-xs font-semibold uppercase tracking-wide text-ink/45">
        {label}
      </dt>
      <dd className="text-sm font-medium text-ink/85">{value || '—'}</dd>
    </div>
  );
}

export default function ResultSummary({ org, programme, scores, onRestart }: Props) {
  const { t } = useI18n();
  const report = buildReport(scores);
  const band = BAND_STYLES[report.band];

  const remarks = fillRemarks(
    t.remarks[report.band],
    org.title || t.result.fallbackProgramme,
    org.ngo || t.result.fallbackNgo,
  );

  const strengths = report.strengthKeys.length
    ? report.strengthKeys.map((k) => t.criteria[k].strength)
    : [t.result.noStrengths];
  const clarifications = report.clarifyKeys.length
    ? report.clarifyKeys.map((k) => t.criteria[k].clarify)
    : [t.result.noClarify];

  return (
    <div className="print-report space-y-6">
      {/* Report header */}
      <div className="border-b border-navy-100 pb-5 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-600">
          {t.result.kicker}
        </p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-navy-900">
          {org.title || t.result.fallbackTitle}
        </h2>
        <p className="mt-1 text-sm text-ink/55">{org.ngo}</p>
      </div>

      {/* Score + status */}
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-10">
        <div className="text-center">
          <p className="text-5xl font-extrabold tracking-tight text-navy-900">
            {report.percent}%
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink/45">
            {t.result.overallScore}
          </p>
        </div>
        <div
          className={`inline-flex items-center gap-2.5 rounded-xl border px-5 py-3.5 ${band.wrap}`}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${band.dot}`} />
          <span className={`text-base font-bold ${band.text}`}>{t.bands[report.band]}</span>
        </div>
      </div>

      {/* Submission details */}
      <dl className="rounded-xl border border-navy-100 bg-navy-50/40 px-5 py-2">
        <Row label={t.result.ngo} value={org.ngo} />
        <Row label={t.result.provider} value={org.provider} />
        <Row label={t.result.title} value={org.title} />
        <Row label={t.result.category} value={programme.category} />
        <Row label={t.result.target} value={programme.target} />
        <Row
          label={t.result.expected}
          value={programme.expected ? `${programme.expected} ${t.result.pax}` : ''}
        />
        <Row
          label={t.result.locationDate}
          value={[programme.location, programme.date].filter(Boolean).join(' · ')}
        />
        <Row label={t.result.duration} value={programme.duration} />
        <Row label={t.result.requested} value={programme.budget ? `RM ${programme.budget}` : ''} />
      </dl>

      {/* Criterion scores */}
      <div className="rounded-xl border border-navy-100 px-5 py-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-ink/50">
          {t.result.criterionScores}
        </h3>
        <ul className="mt-3 space-y-2">
          {CRITERION_KEYS.map((key) => {
            const s = scores[key];
            return (
              <li key={key} className="flex items-center gap-3">
                <span className="w-64 flex-none truncate text-sm text-ink/75">
                  {t.criteria[key].label}
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-navy-100">
                  <span
                    className="block h-full rounded-full bg-navy-600"
                    style={{ width: `${(s / 5) * 100}%` }}
                  />
                </span>
                <span className="w-20 flex-none text-right text-sm font-bold text-navy-800">
                  {s}/5{' '}
                  <span className="text-[10px] font-medium text-ink/40">{t.scoreLabels[s]}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Strengths & clarifications */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-teal-100 bg-teal-50/50 px-5 py-4">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-teal-700">
            <CheckCircle2 size={15} /> {t.result.keyStrengths}
          </h3>
          <ul className="mt-3 space-y-2">
            {strengths.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink/75">
                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-teal-500" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-gold-100 bg-gold-50/60 px-5 py-4">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gold-700">
            <AlertTriangle size={15} /> {t.result.itemsClarification}
          </h3>
          <ul className="mt-3 space-y-2">
            {clarifications.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink/75">
                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-gold-500" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Remarks & next action */}
      <div className="rounded-xl border border-navy-100 px-5 py-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-ink/50">
          {t.result.committeeRemarks}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/75">{remarks}</p>
      </div>
      <div className={`rounded-xl border px-5 py-4 ${band.wrap}`}>
        <h3 className={`text-sm font-bold uppercase tracking-wide ${band.text}`}>
          {t.result.suggestedNextAction}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/80">{t.nextActions[report.band]}</p>
      </div>

      <p className="text-center text-[11px] text-ink/35">{t.result.generatedBy}</p>

      {/* Actions */}
      <div className="no-print flex flex-col justify-center gap-3 pt-1 sm:flex-row">
        <button type="button" onClick={() => window.print()} className="btn-primary">
          <Printer size={16} />
          {t.result.print}
        </button>
        <button type="button" onClick={onRestart} className="btn-secondary">
          <RotateCcw size={15} />
          {t.result.restart}
        </button>
      </div>
    </div>
  );
}
