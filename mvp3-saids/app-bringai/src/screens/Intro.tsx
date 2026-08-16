import type { L, Lang } from '../types';
import { PROOF } from '../data/proof';
import { UI, fill, t } from '../i18n/dict';

const LEAKS: { code: string; name: L; desc: L }[] = [
  {
    code: 'L1',
    name: ['Response Lag', 'Kelewatan Membalas', '回复迟缓', 'Kelewa Nyaut'],
    desc: [
      'The enquiry that waited two days and bought elsewhere.',
      'Pertanyaan yang menunggu dua hari lalu membeli di tempat lain.',
      '等了两天没回音，客户就去别家买了。',
      'Tanya ti nganti dua hari lalu meli ba endur bukai.',
    ],
  },
  {
    code: 'L2',
    name: ['Manual Repetition', 'Kerja Berulang Manual', '重复的人工', 'Pengawa Belalauka Diri'],
    desc: [
      'Hours a week retyping what a machine should move.',
      'Berjam-jam seminggu menaip semula apa yang mesin patut pindahkan.',
      '每周花好几小时重打机器本该搬的东西。',
      'Berjam seminggu nulis baru utai ti patut dipindah mesin.',
    ],
  },
  {
    code: 'L3',
    name: ['Invisible Offer', 'Tawaran Tidak Kelihatan', '看不见的产品', 'Tawar Ti Enda Dipeda'],
    desc: [
      "You're good at something nobody can find you for.",
      'Anda pakar dalam sesuatu tetapi tiada siapa jumpa anda.',
      '你很擅长某件事，却没人找得到你。',
      'Nuan landik ba siti utai tang nadai orang ulih nemu nuan.',
    ],
  },
  {
    code: 'L4',
    name: ['Quote Drag', 'Kelewatan Sebut Harga', '报价拖延', 'Kelewa Sebut Rega'],
    desc: [
      'The proposal that took five days while urgency cooled.',
      'Cadangan yang mengambil lima hari sementara desakan reda.',
      '提案做了五天，客户的急迫感早就凉了。',
      'Cadangan ti lima hari digaga lalu ati pelanggan udah chelap.',
    ],
  },
  {
    code: 'L5',
    name: ['One-Head Dependency', 'Kebergantungan Satu Kepala', '一人依赖', 'Begantung Ba Siti Pala'],
    desc: [
      'The business stops when you take a week off.',
      'Perniagaan terhenti bila anda bercuti seminggu.',
      '你休一周假，生意就停摆。',
      'Dagang badu lebuh nuan cuti seminggu.',
    ],
  },
  {
    code: 'L6',
    name: ['Untapped Asset', 'Aset Belum Digunakan', '闲置的资产', 'Aset Ti Apin Dikena'],
    desc: [
      'Data or know-how you already own and never sell.',
      'Data atau kepakaran yang anda miliki tetapi tidak pernah dijual.',
      '你早已拥有、却从没拿去卖的数据或专业。',
      'Data tauka penemu ti udah bisi ba nuan tang nadai kala dijual.',
    ],
  },
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
  const go = resumeCount !== null ? onResume : onStart;

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="on-navy hero">
        <div className="shell">
          <span className="badge">{t(UI.heroBadge, lang)}</span>
          <h1>
            {t(UI.heroTitle, lang)} <em>{t(UI.heroTitleAccent, lang)}</em>
          </h1>
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
        </div>
      </section>

      {/* ── Proof ─────────────────────────────────────────────── */}
      <section className="on-cream sect sect-center">
        <div className="shell">
          <span className="badge">{t(UI.proofBadge, lang)}</span>
          <h2>{t(UI.proofTitle, lang)}</h2>
          <p className="lead">{t(UI.proofSub, lang)}</p>
          <div className="cards cards-3">
            {PROOF.map((p) => (
              <div className="card stat" key={p.figure}>
                <div className="fig">{p.figure}</div>
                <p>{t(p.claim, lang)}</p>
                <div className="src">
                  {t(UI.sourceLabel, lang)}:{' '}
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    {p.source}, {p.year} ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p className="pull">{t(UI.proofClose, lang)}</p>
        </div>
      </section>

      {/* ── What is happening in your market ──────────────────── */}
      <section className="on-navy sect sect-center">
        <div className="shell">
          <span className="badge">{t(UI.shiftBadge, lang)}</span>
          <h2>{t(UI.shiftTitle, lang)}</h2>
          <div className="cards cards-3">
            {UI.shiftBlocks.map(([head, body], n) => (
              <div className="card" key={n}>
                <div className="head">
                  <span className="tile" aria-hidden="true">
                    {String(n + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3>{t(head, lang)}</h3>
                <p>{t(body, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI as the operator underneath ─────────────────────── */}
      <section className="on-cream sect sect-center">
        <div className="shell shell-narrow">
          <span className="badge">{t(UI.servantBadge, lang)}</span>
          <h2>{t(UI.servantTitle, lang)}</h2>
          <p className="lead">{t(UI.servantBody, lang)}</p>
          <ul className="checks checks-2">
            {UI.servantPoints.map((p, n) => (
              <li key={n}>{t(p, lang)}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── The six leaks ─────────────────────────────────────── */}
      <section className="on-navy sect sect-center">
        <div className="shell">
          <span className="badge">{t(UI.leaksBadge, lang)}</span>
          <h2>{t(UI.leaksTitle, lang)}</h2>
          <p className="lead">{t(UI.leaksSub, lang)}</p>
          <div className="cards cards-3">
            {LEAKS.map((l, n) => (
              <div className="card" key={l.code}>
                <div className="head">
                  <span className="tile" aria-hidden="true">
                    {l.code}
                  </span>
                  <span className="n">{String(n + 1).padStart(2, '0')}</span>
                </div>
                <h3>{t(l.name, lang)}</h3>
                <p>{t(l.desc, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What you get ──────────────────────────────────────── */}
      <section className="on-cream sect sect-center">
        <div className="shell shell-narrow">
          <span className="badge">{t(UI.getBadge, lang)}</span>
          <h2>{t(UI.whatYouGet, lang)}</h2>
          <ul className="checks">
            {UI.getList.map((row, n) => (
              <li key={n}>{t(row, lang)}</li>
            ))}
          </ul>
          <div className="cta-row" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <button className="btn" onClick={go}>
              {t(UI.start, lang)} →
            </button>
          </div>
        </div>
      </section>

      {/* ── Who ───────────────────────────────────────────────── */}
      <section className="on-navy sect sect-center">
        <div className="shell shell-narrow">
          <span className="badge">{t(UI.whoBadge, lang)}</span>
          <h2>{t(UI.whoTitle, lang)}</h2>
          <p className="lead">{t(UI.whoBody, lang)}</p>
        </div>
      </section>

      {/* ── Close ─────────────────────────────────────────────── */}
      <section className="on-cream sect sect-center">
        <div className="shell shell-narrow">
          <h2>{t(UI.finalTitle, lang)}</h2>
          <p className="lead">{t(UI.finalSub, lang)}</p>
          <div className="cta-row" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
            <button className="btn" onClick={go}>
              {t(UI.start, lang)} →
            </button>
          </div>
          <p className="trust" style={{ color: 'var(--mute-l)' }}>
            {t(UI.trustLine, lang)}
          </p>
        </div>
      </section>
    </main>
  );
}
