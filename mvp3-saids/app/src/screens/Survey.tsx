import { useEffect } from 'react';
import type { AnswerValue, Answers, Lang, RespondentType } from '../types';
import { SECTIONS, questionsFor } from '../data/survey';
import { QuestionControl } from '../components/ui';
import { UI, fill, t } from '../i18n/dict';

export default function Survey({
  lang,
  respondentType,
  index,
  answers,
  setAnswer,
  setIndex,
  onDone,
  onBack,
}: {
  lang: Lang;
  respondentType: RespondentType;
  index: number;
  answers: Answers;
  setAnswer: (id: string, v: AnswerValue) => void;
  setIndex: (n: number) => void;
  onDone: () => void;
  onBack: () => void;
}) {
  const qs = questionsFor(respondentType);
  const q = qs[Math.min(index, qs.length - 1)];
  const section = SECTIONS.find((s) => s.id === q.section);
  const raw = answers[q.id];
  const answered = Array.isArray(raw) ? raw.length > 0 : raw !== undefined;
  const isMulti = q.type === 'multi';
  // Multi-select and sliders both stay put — the respondent may still be adjusting.
  const holds = isMulti || q.type === 'select' || q.type === 'slider';

  const advance = () => {
    if (index + 1 >= qs.length) onDone();
    else setIndex(index + 1);
  };

  const back = () => {
    if (index === 0) onBack();
    else setIndex(index - 1);
  };

  // Single-choice questions advance on their own; multi-select waits for Next.
  const handle = (v: AnswerValue) => {
    setAnswer(q.id, v);
    if (!holds) window.setTimeout(advance, 170);
  };

  // Number keys select, Enter advances. Keyboard completion end to end.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLSelectElement || e.target instanceof HTMLInputElement) return;
      if (e.key === 'Enter' && answered) {
        e.preventDefault();
        advance();
        return;
      }
      const n = Number(e.key);
      if (!n || Number.isNaN(n)) return;
      if (q.type === 'scale' && q.scale && n >= q.scale.min && n <= q.scale.max) {
        handle(n);
      } else if (q.type === 'slider' && q.options && n <= q.options.length) {
        setAnswer(q.id, q.options[n - 1].value);
      } else if (q.options && n <= q.options.length) {
        const v = q.options[n - 1].value;
        if (isMulti) {
          const arr = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
          setAnswer(q.id, arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
        } else {
          handle(v);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const pct = ((index + (answered ? 1 : 0)) / qs.length) * 100;
  const answeredCount = qs.filter((x) => {
    const a = answers[x.id];
    return Array.isArray(a) ? a.length > 0 : a !== undefined;
  }).length;

  return (
    <>
      <div className="progress" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
        <i style={{ width: `${pct}%` }} />
      </div>
      <main className="shell">
        <div className="qwrap">
          <div className="qmeta">
            <span className="sec">{t(section?.name, lang)}</span>
            <span className="mono">
              {t(UI.question, lang)} {index + 1} {t(UI.of, lang)} {qs.length}
            </span>
          </div>
          <h1 className="qtext">{t(q.text, lang)}</h1>
          {q.help && <p className="qhelp">{t(q.help, lang)}</p>}
          <QuestionControl q={q} lang={lang} value={answers[q.id]} onChange={handle} />
          {q.note && <p className="qnote">{t(q.note, lang)}</p>}
        </div>
      </main>
      <div className="shell">
        <div className="actionbar">
          <button className="btn btn-ghost" onClick={back}>
            ← {t(UI.back, lang)}
          </button>
          <span className="saved">{t(UI.autosaved, lang)}</span>
          <button className="btn" onClick={advance} disabled={!answered}>
            {index + 1 >= qs.length ? t(UI.next, lang) : t(UI.next, lang)} →
          </button>
        </div>
      </div>
      <p className="shell" style={{ fontSize: '.72rem', color: 'var(--ink-mute)', paddingBottom: '1.5rem' }}>
        {fill(t(UI.reviewAnswered, lang), {
          a: answeredCount,
          b: qs.length,
        })}
      </p>
    </>
  );
}
