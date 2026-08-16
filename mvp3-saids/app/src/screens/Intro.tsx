import type { Lang } from '../types';
import { UI, fill, t } from '../i18n/dict';

const LEAKS: [string, [string, string], [string, string]][] = [
  [
    'L1',
    ['Response Lag', 'Kelewatan Membalas'],
    ['The enquiry that waited two days and bought elsewhere.', 'Pertanyaan yang menunggu dua hari lalu membeli di tempat lain.'],
  ],
  [
    'L2',
    ['Manual Repetition', 'Kerja Berulang Manual'],
    ['Hours a week retyping what a machine should move.', 'Berjam-jam seminggu menaip semula apa yang mesin patut pindahkan.'],
  ],
  [
    'L3',
    ['Invisible Offer', 'Tawaran Tidak Kelihatan'],
    ["You're good at something nobody can find you for.", 'Anda pakar dalam sesuatu tetapi tiada siapa jumpa anda.'],
  ],
  [
    'L4',
    ['Quote Drag', 'Kelewatan Sebut Harga'],
    ["The proposal that took five days while urgency cooled.", 'Cadangan yang mengambil lima hari sementara desakan reda.'],
  ],
  [
    'L5',
    ['One-Head Dependency', 'Kebergantungan Satu Kepala'],
    ['The business stops when you take a week off.', 'Perniagaan terhenti bila anda bercuti seminggu.'],
  ],
  [
    'L6',
    ['Untapped Asset', 'Aset Belum Digunakan'],
    ['Data or know-how you already own and never sell.', 'Data atau kepakaran yang anda miliki tetapi tidak pernah dijual.'],
  ],
];

export default function Intro({
  lang,
  onStart,
  resumeCount,
  onResume,
  onReset,
}: {
  lang: Lang;
  onStart: () => void;
  resumeCount: number | null;
  onResume: () => void;
  onReset: () => void;
}) {
  const i = lang === 'bm' ? 1 : 0;
  return (
    <main>
      <section className="shell hero">
        <span className="eyebrow">
          {t(UI.brand, lang)} · {t(UI.convenor, lang)}
        </span>
        <h1>{t(UI.heroTitle, lang)}</h1>
        <p className="sub">{t(UI.heroSub, lang)}</p>

        <div className="cta-row">
          {resumeCount !== null ? (
            <>
              <button className="btn" onClick={onResume}>
                {t(UI.resume, lang)} — {fill(t(UI.resumeAt, lang), { n: resumeCount })}
              </button>
              <button className="btn btn-ghost" onClick={onReset}>
                {t(UI.startOver, lang)}
              </button>
            </>
          ) : (
            <button className="btn" onClick={onStart}>
              {t(UI.start, lang)} →
            </button>
          )}
        </div>
        <p className="trust">{t(UI.trustLine, lang)}</p>
      </section>

      <section className="shell block">
        <h2>{t(UI.whatYouGet, lang)}</h2>
        <ul className="getlist">
          {UI.getList.map((row, n) => (
            <li key={n}>{t(row, lang)}</li>
          ))}
        </ul>
      </section>

      <section className="shell block">
        <h2>{t(UI.leaksTitle, lang)}</h2>
        <p className="lead">{t(UI.leaksSub, lang)}</p>
        <ul className="leakgrid">
          {LEAKS.map(([code, name, desc]) => (
            <li key={code}>
              <div className="lc">{code}</div>
              <div className="ln">{name[i]}</div>
              <div className="ld">{desc[i]}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="shell block">
        <h2>{t(UI.whoTitle, lang)}</h2>
        <p className="lead">{t(UI.whoBody, lang)}</p>
        <div className="cta-row">
          <button className="btn" onClick={resumeCount !== null ? onResume : onStart}>
            {t(UI.start, lang)} →
          </button>
        </div>
      </section>
    </main>
  );
}
