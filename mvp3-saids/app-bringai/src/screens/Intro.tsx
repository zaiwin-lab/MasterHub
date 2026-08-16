import type { Lang } from '../types';
import { PROOF } from '../data/proof';
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
    ['The proposal that took five days while urgency cooled.', 'Cadangan yang mengambil lima hari sementara desakan reda.'],
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
  const go = resumeCount !== null ? onResume : onStart;

  return (
    <main>
      {/* ── The shift ─────────────────────────────────────────── */}
      <section className="shell hero">
        <span className="lbl">{t(UI.heroKicker, lang)}</span>
        <h1>{t(UI.heroTitle, lang)}</h1>
        <p className="sub">{t(UI.heroSub, lang)}</p>
        <div className="cta-row">
          {resumeCount !== null ? (
            <>
              <button className="btn" onClick={onResume}>
                {t(UI.resume, lang)} — {fill(t(UI.resumeAt, lang), { n: resumeCount })} →
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

      {/* ── Proof: measured, sourced, linked ──────────────────── */}
      <section className="shell block">
        <span className="lbl">01 — {t(UI.sourceLabel, lang)}</span>
        <h2>{t(UI.proofTitle, lang)}</h2>
        <p className="lead">{t(UI.proofSub, lang)}</p>
        <div className="readout">
          {PROOF.map((p) => (
            <div className="stat" key={p.figure}>
              <div className="fig">{p.figure}</div>
              <div className="cl">{t(p.claim, lang)}</div>
              <div className="src">
                <a href={p.url} target="_blank" rel="noopener noreferrer">
                  {p.source}, {p.year} ↗
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="proof-close">{t(UI.proofClose, lang)}</p>
      </section>

      {/* ── What is happening in your market ──────────────────── */}
      <section className="shell block">
        <span className="lbl">02</span>
        <h2>{t(UI.shiftTitle, lang)}</h2>
        <ul className="shifts">
          {UI.shiftBlocks.map(([head, body], n) => (
            <li key={n}>
              <span className="n">0{n + 1}</span>
              <h3>{head[i]}</h3>
              <p>{body[i]}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── AI as the operator underneath ─────────────────────── */}
      <section className="shell block">
        <span className="lbl">03</span>
        <h2>{t(UI.servantTitle, lang)}</h2>
        <div className="servant">
          <p style={{ color: 'var(--soft)' }}>{t(UI.servantBody, lang)}</p>
          <ul>
            {UI.servantPoints.map((p, n) => (
              <li key={n}>{t(p, lang)}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── The six leaks — self-diagnosis before question one ─ */}
      <section className="shell block">
        <span className="lbl">04</span>
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

      {/* ── What you get ──────────────────────────────────────── */}
      <section className="shell block">
        <span className="lbl">05</span>
        <h2>{t(UI.whatYouGet, lang)}</h2>
        <ul className="getlist">
          {UI.getList.map((row, n) => (
            <li key={n} data-n={`0${n + 1}`}>
              {t(row, lang)}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Who ───────────────────────────────────────────────── */}
      <section className="shell block">
        <span className="lbl">06</span>
        <h2>{t(UI.whoTitle, lang)}</h2>
        <p className="lead">{t(UI.whoBody, lang)}</p>
      </section>

      {/* ── Close ─────────────────────────────────────────────── */}
      <section className="shell block">
        <h2>{t(UI.finalTitle, lang)}</h2>
        <p className="lead">{t(UI.finalSub, lang)}</p>
        <div className="cta-row" style={{ marginTop: '1.6rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
          <button className="btn" onClick={go}>
            {t(UI.start, lang)} →
          </button>
        </div>
        <p className="trust">{t(UI.trustLine, lang)}</p>
      </section>
    </main>
  );
}
