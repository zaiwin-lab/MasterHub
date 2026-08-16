import { useEffect, useRef, useState } from 'react';
import type { Answers, Consents, Lang, LensKey, Snapshot } from '../types';
import { CONST, money } from '../lib/scoring';
import {
  bookingConfigured,
  bookingUrl,
  captureConfigured,
  isEmail,
  saveScan,
  whatsappConfigured,
  whatsappUrl,
  type Contact,
} from '../lib/capture';
import { Field } from '../components/ui';
import { UI, t } from '../i18n/dict';

function useCountUp(target: number) {
  const [n, setN] = useState(target);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return setN(target);
    setN(0);
    const t0 = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return n;
}

const LENS_LABEL: Record<LensKey, keyof typeof UI> = {
  build_readiness: 'buildReadiness',
  hidden_potential: 'hiddenPotential',
  market_pull: 'marketPull',
};

export default function SnapshotView({
  snap,
  lang,
  answers,
  consents,
}: {
  snap: Snapshot;
  lang: Lang;
  answers: Answers;
  consents: Consents;
}) {
  const [showWork, setShowWork] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const index = useCountUp(snap.mvp3_index);

  const losses = snap.leaks
    .filter((l) => l.kind === 'loss' && l.amount !== null)
    .sort((a, b) => (b.amount as number) - (a.amount as number))
    .slice(0, 3);
  const others = snap.leaks.filter((l) => !losses.includes(l) && (l.kind !== 'loss' || l.amount === null));

  const waText =
    `Hi KOBIS — I just finished the MVP³ Potential Scan.\n` +
    `Scan: ${snap.scan_id}\n` +
    `MVP³ Index: ${snap.mvp3_index} (${snap.band_label[0]})\n` +
    (snap.total_monthly_leak !== null ? `Estimated leak: ${money(snap.total_monthly_leak)}/month\n` : '') +
    `Candidate: ${snap.mvp3_candidate.name[0]}\n` +
    `I'd like to talk it through.`;

  return (
    <div className="snap">
      <main className="shell shell-wide">
        {/* ── Score ─────────────────────────────────────────────── */}
        <section className="scorehead">
          <span className="eyebrow">{t(UI.yourIndex, lang)}</span>
          <div className="bigscore">{index}</div>
          <div className="bandlabel">{t(snap.band_label, lang)}</div>
          <p className="bandnote">{t(snap.band_note, lang)}</p>
          <div className="confline">
            {t(UI.confidence, lang)}: {t(snap.confidence === 'low' ? UI.confLow : UI.confModerate, lang)} ·{' '}
            {t(UI.confWhy, lang)}
          </div>
        </section>

        {/* ── Lenses ────────────────────────────────────────────── */}
        <section className="sec-rule">
          <h2>{t(UI.lenses, lang)}</h2>
          <div className="lensrow">
            {(Object.keys(LENS_LABEL) as LensKey[]).map((k) => {
              const v = snap.lens_scores[k];
              return (
                <div className="lens" key={k}>
                  <div className="ln">{t(UI[LENS_LABEL[k]] as never, lang)}</div>
                  {v === null ? (
                    <div className="insuf">{t(UI.insufficient, lang)}</div>
                  ) : (
                    <>
                      <div className="lv">{v}</div>
                      <div className="lb">
                        <i style={{ width: `${v}%` }} />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Leakage Ledger ────────────────────────────────────── */}
        <section className="sec-rule">
          <h2>{t(UI.ledgerTitle, lang)}</h2>
          <p style={{ marginTop: '.5rem' }}>{t(UI.ledgerSub, lang)}</p>

          {snap.total_monthly_leak === null && <p className="workings">{t(UI.noFigure, lang)}</p>}

          <div className="ledger">
            {losses.map((l) => (
              <div className="leakrow" key={l.code}>
                <div className="top">
                  <span className="id">
                    <span className="code">{l.code}</span>
                    <span className="nm">{t(l.name, lang)}</span>
                  </span>
                  <span className="amt">
                    {money(l.amount as number)}
                    <span style={{ fontSize: '.62em', fontWeight: 400 }}>{t(UI.perMonth, lang)}</span>
                  </span>
                </div>
                <div className="why">{t(l.why, lang)}</div>
                <div className="fix">→ {t(l.fix, lang)}</div>
                <div>
                  <span className="tag">{t(UI.estimate, lang)}</span>
                </div>
                {showWork && l.workings && <div className="workings">{t(l.workings, lang)}</div>}
              </div>
            ))}

            {others.map((l) => (
              <div className="leakrow" key={l.code}>
                <div className="top">
                  <span className="id">
                    <span className="code">{l.code}</span>
                    <span className="nm">{t(l.name, lang)}</span>
                  </span>
                  {l.amount !== null && (
                    <span className="amt" style={{ opacity: 0.75 }}>
                      {money(l.amount)}
                      <span style={{ fontSize: '.62em', fontWeight: 400 }}>{t(UI.perMonth, lang)}</span>
                    </span>
                  )}
                </div>
                <div className="why">{t(l.why, lang)}</div>
                <div className="fix">→ {t(l.fix, lang)}</div>
                <div>
                  <span className="tag">{t(UI.opportunity, lang)}</span>
                </div>
                {showWork && l.workings && <div className="workings">{t(l.workings, lang)}</div>}
              </div>
            ))}
          </div>

          {snap.total_monthly_leak !== null && (
            <>
              <div className="totalrow">
                <span className="lbl">{t(UI.totalLeak, lang)}</span>
                <span className="amt">
                  {money(snap.total_monthly_leak)}
                  <span style={{ fontSize: '.5em', fontWeight: 400 }}>{t(UI.perMonth, lang)}</span>
                </span>
              </div>
              {snap.leak_capped && <p style={{ fontSize: '.82rem', marginTop: '.6rem' }}>{t(UI.cappedNote, lang)}</p>}
            </>
          )}

          <button className="disclose" onClick={() => setShowWork(!showWork)}>
            {showWork ? t(UI.hideWorkings, lang) : t(UI.showWorkings, lang)}
          </button>

          {showWork && (
            <div className="workings" style={{ marginTop: '.8rem' }}>
              {`Constants used\n` +
                `  loaded hourly cost      ${money(CONST.LOADED_HOURLY_COST)}\n` +
                `  owner hourly value      ${money(CONST.OWNER_HOURLY_VALUE)}\n` +
                `  assumed close rate      ${CONST.DEFAULT_CLOSE_RATE * 100}%\n` +
                `  automatable share       ${CONST.AUTOMATABLE_SHARE * 100}%\n` +
                `  cap vs monthly revenue  ${CONST.LEAK_CAP_VS_REVENUE * 100}%\n` +
                `\nOnly L1, L2, L4 and L5 are summed. L3 and L6 are opportunity, not loss.`}
            </div>
          )}
        </section>

        {/* ── Cost of Delay ─────────────────────────────────────── */}
        {snap.cost_of_delay_90 !== null && (
          <section className="sec-rule">
            <h2>{t(UI.delayTitle, lang)}</h2>
            <div className="delay">
              <p>{t(UI.delayBody, lang)}</p>
              <div className="amt">{money(snap.cost_of_delay_90)}</div>
              <p style={{ marginTop: '.6rem', fontSize: '.84rem' }}>
                {t(UI.estimate, lang)} · {money(snap.total_monthly_leak as number)}
                {t(UI.perMonth, lang)} × 3
              </p>
            </div>
          </section>
        )}

        {/* ── Candidate ─────────────────────────────────────────── */}
        <section className="sec-rule">
          <h2>{t(UI.candidateTitle, lang)}</h2>
          <p style={{ marginTop: '.5rem' }}>{t(UI.candidateSub, lang)}</p>
          <div className="candidate">
            <div className="nm">{t(snap.mvp3_candidate.name, lang)}</div>
            <p style={{ marginTop: '.7rem' }}>{t(snap.mvp3_candidate.what, lang)}</p>
            <div className="win">
              {t(UI.buildWindow, lang)} — {t(snap.mvp3_candidate.window, lang)}
            </div>
          </div>
        </section>

        {/* ── The First 7 — free, and deliberately before any CTA ─ */}
        <section className="sec-rule">
          <h2>{t(UI.firstSeven, lang)}</h2>
          <p style={{ marginTop: '.5rem' }}>{t(UI.firstSevenSub, lang)}</p>
          <ul className="moves">
            {snap.first_seven.map((f, i) => (
              <li key={i}>
                <span className="h">{String(i + 1).padStart(2, '0')}</span>
                <span className="a">{t(f.action, lang)}</span>
                <p style={{ fontSize: '.86rem' }}>{t(f.why, lang)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="sec-rule">
          <h2>{t(UI.nextMoves, lang)}</h2>
          <p style={{ marginTop: '.5rem' }}>{t(UI.nextMovesSub, lang)}</p>
          <ul className="moves">
            {snap.next_moves.map((m, i) => (
              <li key={i}>
                <span className="h">{t(m.horizon, lang)}</span>
                <span className="a">{t(m.action, lang)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Honesty panel ─────────────────────────────────────── */}
        <section className="sec-rule">
          <h2>{t(UI.honestyTitle, lang)}</h2>
          <div className="honesty">
            <ul>
              {UI.honestyItems.map((h, i) => (
                <li key={i}>{t(h, lang)}</li>
              ))}
            </ul>
            {snap.limitations.length > 0 && (
              <>
                <p style={{ marginTop: '1rem', color: 'var(--void-ink)', fontWeight: 600 }}>
                  {t(UI.limitationsTitle, lang)}
                </p>
                <ul>
                  {snap.limitations.map((l, i) => (
                    <li key={i}>{t(l, lang)}</li>
                  ))}
                </ul>
              </>
            )}
            <button className="disclose" onClick={() => setShowJson(!showJson)}>
              {showJson ? t(UI.hideJson, lang) : t(UI.showJson, lang)}
            </button>
            {showJson && <pre className="jsonbox">{JSON.stringify(snap, null, 2)}</pre>}
          </div>
        </section>

        {/* ── Conversion surface ────────────────────────────────── */}
        <section className="sec-rule">
          <SaveBlock snap={snap} lang={lang} answers={answers} consents={consents} />

          <div className="ctas">
            {bookingConfigured && (
              <a className="cta primary" href={bookingUrl(snap.scan_id)} target="_blank" rel="noopener">
                <span className="h">{t(UI.ctaReadout, lang)}</span>
                <span className="s">{t(UI.ctaReadoutSub, lang)}</span>
              </a>
            )}
            {whatsappConfigured && (
              <a className="cta" href={whatsappUrl(waText)} target="_blank" rel="noopener">
                <span className="h">{t(UI.ctaWhatsapp, lang)}</span>
                <span className="s">{snap.scan_id}</span>
              </a>
            )}
            <button className="cta" onClick={() => window.print()}>
              <span className="h">{t(UI.ctaPrint, lang)}</span>
              <span className="s">{snap.generated_at.slice(0, 10)}</span>
            </button>
          </div>
        </section>

        <footer className="foot">
          <span className="mono">
            {snap.scan_id} · instrument {snap.instrument_version} · scoring {snap.scoring_version}
          </span>
          <span>
            {t(UI.footerCredit, lang).replace('KOBIS Berhad', '')}
            <a href="https://www.kobisberhad.com" target="_blank" rel="noopener">
              KOBIS Berhad
            </a>
          </span>
        </footer>
      </main>
    </div>
  );
}

function SaveBlock({
  snap,
  lang,
  answers,
  consents,
}: {
  snap: Snapshot;
  lang: Lang;
  answers: Answers;
  consents: Consents;
}) {
  const [c, setC] = useState<Contact>({ name: '', email: '', phone: '', business: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err' | 'invalid'>('idle');

  if (!captureConfigured) return null;

  const submit = async () => {
    if (!isEmail(c.email)) return setStatus('invalid');
    setStatus('sending');
    try {
      await saveScan(c, snap, consents, answers as Record<string, unknown>);
      setStatus('ok');
    } catch {
      setStatus('err');
    }
  };

  return (
    <div className="cta primary" style={{ display: 'block' }}>
      <div className="h">{t(UI.ctaSave, lang)}</div>
      <div className="s">{t(UI.ctaSaveSub, lang)}</div>
      {status === 'ok' ? (
        <p className="formnote ok">{t(UI.sent, lang)}</p>
      ) : (
        <>
          <Field label={t(UI.name, lang)}>
            <input value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} autoComplete="name" />
          </Field>
          <Field label={t(UI.email, lang)}>
            <input
              value={c.email}
              onChange={(e) => setC({ ...c, email: e.target.value })}
              type="email"
              inputMode="email"
              autoComplete="email"
            />
          </Field>
          <Field label={t(UI.business, lang)}>
            <input value={c.business} onChange={(e) => setC({ ...c, business: e.target.value })} />
          </Field>
          <Field label={t(UI.phone, lang)}>
            <input
              value={c.phone}
              onChange={(e) => setC({ ...c, phone: e.target.value })}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
            />
          </Field>
          <button
            className="btn btn-block"
            style={{ marginTop: '1rem' }}
            onClick={submit}
            disabled={status === 'sending'}
          >
            {status === 'sending' ? t(UI.sending, lang) : t(UI.send, lang)}
          </button>
          {status === 'invalid' && <p className="formnote err">{t(UI.emailInvalid, lang)}</p>}
          {status === 'err' && <p className="formnote err">{t(UI.sendFailed, lang)}</p>}
        </>
      )}
    </div>
  );
}
