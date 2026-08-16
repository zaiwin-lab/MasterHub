import { useEffect, useState } from 'react';
import type { Answers, Lang, RespondentType } from '../types';
import { questionsFor } from '../data/survey';
import { UI, fill, t } from '../i18n/dict';

export function Review({
  lang,
  respondentType,
  answers,
  onGenerate,
  onBack,
}: {
  lang: Lang;
  respondentType: RespondentType;
  answers: Answers;
  onGenerate: () => void;
  onBack: () => void;
}) {
  const qs = questionsFor(respondentType);
  const answered = qs.filter((q) => {
    const a = answers[q.id];
    return Array.isArray(a) ? a.length > 0 : a !== undefined;
  }).length;

  return (
    <main className="shell shell-narrow" style={{ paddingBlock: '3rem', paddingBottom: '6rem' }}>
      <span className="badge">{t(UI.brand, lang)}</span>
      <h1 style={{ fontSize: '1.95rem', marginTop: '1rem' }}>{t(UI.reviewTitle, lang)}</h1>
      <p style={{ marginTop: '.9rem', color: 'var(--soft-d)', maxWidth: '46ch' }}>{t(UI.reviewBody, lang)}</p>
      <p className="mono" style={{ marginTop: '1.4rem', fontSize: '.82rem', color: 'var(--mute-d)' }}>
        {fill(t(UI.reviewAnswered, lang), { a: answered, b: qs.length })}
      </p>
      <div className="actionbar" style={{ marginTop: '1.8rem' }}>
        <button className="btn btn-ghost" onClick={onBack}>
          ← {t(UI.back, lang)}
        </button>
        <button className="btn" onClick={onGenerate}>
          {t(UI.generate, lang)} →
        </button>
      </div>
    </main>
  );
}

export function Processing({ lang, onDone }: { lang: Lang; onDone: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const a = window.setTimeout(() => setStage(1), 950);
    const b = window.setTimeout(() => setStage(2), 1950);
    const c = window.setTimeout(onDone, 3100);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
      window.clearTimeout(c);
    };
  }, [onDone]);

  const lines = [UI.proc1, UI.proc2, UI.proc3];

  return (
    <main className="shell proc" aria-live="polite">
      {lines.map((l, i) => (
        <div key={i} className={`procline ${stage >= i ? 'on' : ''}`}>
          <i>{stage > i ? '✓' : '·'}</i>
          {t(l, lang)}
        </div>
      ))}
    </main>
  );
}
