import type { CSSProperties, ReactNode } from 'react';
import type { AnswerValue, Lang, Question } from '../types';
import { DECLINED, NOT_SURE } from '../types';
import { LANGS, UI, fill, t } from '../i18n/dict';

export function Chrome({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <header className="chrome">
      <div className="shell chrome-in">
        <div className="wordmark">
          MVP<sup>3</sup>
          <span>{t(UI.brand, lang).replace('MVP³ ', '')}</span>
        </div>
        <div className="langs" role="group" aria-label="Language">
          {LANGS.map((l) => (
            <button key={l.code} aria-pressed={lang === l.code} onClick={() => setLang(l.code)}>
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

export function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="shell foot">
      <span className="kobis-bar">
        {t(UI.footerCredit, lang)}{' '}
        <a className="kobis-link" href="https://www.kobisberhad.com" target="_blank" rel="noopener">
          KOBIS Berhad
        </a>
      </span>
      <span className="mono">
        © {new Date().getFullYear()} KOBIS BERHAD · KAPT — KOBIS AI PRODIGY TEAM
      </span>
    </footer>
  );
}

/** Renders the control for one question. Escape hatches are stored as their own
 *  sentinel values so "not sure" is never confused with an unanswered question. */
export function QuestionControl({
  q,
  lang,
  value,
  onChange,
}: {
  q: Question;
  lang: Lang;
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue) => void;
}) {
  const isEscape = value === NOT_SURE || value === DECLINED;

  if (q.type === 'scale' && q.scale) {
    const steps = [];
    for (let i = q.scale.min; i <= q.scale.max; i++) steps.push(i);
    return (
      <div className="qbody">
        <div className="scalebar" role="group">
          {steps.map((n) => (
            <button key={n} aria-pressed={value === n} onClick={() => onChange(n)}>
              {n}
            </button>
          ))}
        </div>
        <div className="scaleends">
          <span>{t(q.scale.minLabel, lang)}</span>
          <span>{t(q.scale.maxLabel, lang)}</span>
        </div>
        <Escapes q={q} value={value} onChange={onChange} lang={lang} />
      </div>
    );
  }

  if (q.type === 'slider' && q.options) {
    const opts = q.options;
    const idx = typeof value === 'string' ? opts.findIndex((o) => o.value === value) : -1;
    const set = (n: number) => onChange(opts[n].value);
    // Unanswered rests at the midpoint with the readout dimmed, so the control
    // never implies an answer the respondent has not actually given.
    const pos = idx >= 0 ? idx : Math.floor((opts.length - 1) / 2);
    const pct = opts.length > 1 ? (pos / (opts.length - 1)) * 100 : 0;

    return (
      <div className="qbody">
        <div className="slider" style={{ '--pos': `${pct}%` } as CSSProperties}>
          <div className={`slider-readout ${idx < 0 ? 'idle' : ''}`}>
            {idx >= 0 ? t(opts[pos].label, lang) : t(UI.slideToSet, lang)}
          </div>
          <div className="slider-track">
            <span className="fill" />
            <span className="thumb" />
            <input
              type="range"
              min={0}
              max={opts.length - 1}
              step={1}
              value={pos}
              onChange={(e) => set(Number(e.target.value))}
              aria-label={t(q.text, lang)}
              aria-valuetext={idx >= 0 ? t(opts[pos].label, lang) : t(UI.slideToSet, lang)}
            />
          </div>
          <div className="slider-ticks">
            {opts.map((o, n) => (
              <button
                key={o.value}
                type="button"
                className={n === idx ? 'on' : ''}
                aria-pressed={n === idx}
                onClick={() => set(n)}
              >
                {t(o.label, lang)}
              </button>
            ))}
          </div>
        </div>
        <Escapes q={q} value={value} onChange={onChange} lang={lang} />
      </div>
    );
  }

  if (q.type === 'select') {
    return (
      <div className="qbody">
        <select
          className="native"
          value={typeof value === 'string' && !isEscape ? value : ''}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>
            —
          </option>
          {q.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {t(o.label, lang)}
            </option>
          ))}
        </select>
        <Escapes q={q} value={value} onChange={onChange} lang={lang} />
      </div>
    );
  }

  if (q.type === 'multi') {
    const arr = Array.isArray(value) ? value : [];
    const cap = q.maxSelect ?? 99;
    const toggle = (v: string) => {
      if (arr.includes(v)) onChange(arr.filter((x) => x !== v));
      else if (arr.length < cap) onChange([...arr, v]);
    };
    return (
      <div className="qbody">
        <div className="opts">
          {q.options?.map((o, i) => {
            const on = arr.includes(o.value);
            return (
              <button key={o.value} className="opt" aria-pressed={on} onClick={() => toggle(o.value)}>
                <span className="k">{i + 1}</span>
                {t(o.label, lang)}
              </button>
            );
          })}
        </div>
        {q.maxSelect && (
          <p className="qnote">
            {fill(t(UI.selectUpTo, lang), { n: q.maxSelect })}
            {arr.length > 0 && ` — ${arr.length}/${cap}`}
          </p>
        )}
        <Escapes q={q} value={value} onChange={onChange} lang={lang} />
      </div>
    );
  }

  const rowish = q.type === 'segmented' && (q.options?.length ?? 0) <= 5;
  return (
    <div className="qbody">
      <div className={q.type === 'segmented' ? `seg ${rowish ? 'seg-row' : ''}` : 'opts'}>
        {q.options?.map((o, i) => (
          <button key={o.value} className="opt" aria-pressed={value === o.value} onClick={() => onChange(o.value)}>
            {q.type !== 'segmented' && <span className="k">{i + 1}</span>}
            {t(o.label, lang)}
          </button>
        ))}
      </div>
      <Escapes q={q} value={value} onChange={onChange} lang={lang} />
    </div>
  );
}

function Escapes({
  q,
  value,
  onChange,
  lang,
}: {
  q: Question;
  value: AnswerValue | undefined;
  onChange: (v: AnswerValue) => void;
  lang: Lang;
}) {
  if (!q.allowNotSure && !q.allowDecline) return null;
  return (
    <div className="escape">
      {q.allowNotSure && (
        <button aria-pressed={value === NOT_SURE} onClick={() => onChange(NOT_SURE)}>
          {t(UI.notSure, lang)}
        </button>
      )}
      {q.allowDecline && (
        <button aria-pressed={value === DECLINED} onClick={() => onChange(DECLINED)}>
          {t(UI.decline, lang)}
        </button>
      )}
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="field">
      <span className="lab">
        {label}
        {hint ? ` · ${hint}` : ''}
      </span>
      {children}
    </label>
  );
}
