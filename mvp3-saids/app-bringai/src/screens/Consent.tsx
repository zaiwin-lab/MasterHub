import type { Consents, Lang, RespondentType } from '../types';
import { UI, t } from '../i18n/dict';

export function Consent({
  lang,
  consents,
  setConsents,
  onContinue,
  onBack,
}: {
  lang: Lang;
  consents: Consents;
  setConsents: (c: Consents) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const set = (k: 'research' | 'reportEmail' | 'futureComms') => (v: boolean) =>
    setConsents({ ...consents, [k]: v, timestampIso: new Date().toISOString() });

  return (
    <main className="shell shell-narrow" style={{ paddingBlock: '2.5rem' }}>
      <span className="badge">{t(UI.brand, lang)}</span>
      <h1 style={{ fontSize: '1.75rem', marginTop: '1rem' }}>{t(UI.consentTitle, lang)}</h1>
      <p style={{ marginTop: '.9rem', color: 'var(--soft-d)', maxWidth: '48ch' }}>{t(UI.consentBody, lang)}</p>

      <div style={{ marginTop: '1.6rem' }}>
        <label className="check">
          <input type="checkbox" checked={consents.research} onChange={(e) => set('research')(e.target.checked)} />
          <span>{t(UI.consentResearch, lang)}</span>
        </label>
        <label className="check">
          <input type="checkbox" checked={consents.reportEmail} onChange={(e) => set('reportEmail')(e.target.checked)} />
          <span>{t(UI.consentEmail, lang)}</span>
        </label>
        <label className="check">
          <input type="checkbox" checked={consents.futureComms} onChange={(e) => set('futureComms')(e.target.checked)} />
          <span>{t(UI.consentComms, lang)}</span>
        </label>
      </div>

      <div className="actionbar" style={{ marginTop: '1.5rem' }}>
        <button className="btn btn-ghost" onClick={onBack}>
          {t(UI.back, lang)}
        </button>
        <button className="btn" onClick={onContinue}>
          {t(UI.consentContinue, lang)} →
        </button>
      </div>
    </main>
  );
}

export function RespondentPick({
  lang,
  onPick,
  onBack,
}: {
  lang: Lang;
  onPick: (t: RespondentType) => void;
  onBack: () => void;
}) {
  const rows: { key: RespondentType; label: string; note: string }[] = [
    { key: 'owner', label: t(UI.owner, lang), note: t(UI.ownerNote, lang) },
    { key: 'executive', label: t(UI.executive, lang), note: t(UI.executiveNote, lang) },
    { key: 'founder', label: t(UI.founder, lang), note: t(UI.founderNote, lang) },
  ];
  return (
    <main className="shell shell-narrow" style={{ paddingBlock: '2.5rem' }}>
      <span className="badge">{t(UI.brand, lang)}</span>
      <h1 className="qtext" style={{ marginTop: '.6rem' }}>
        {t(UI.whoAreYou, lang)}
      </h1>
      <div className="opts" style={{ marginTop: '1.6rem' }}>
        {rows.map((r, i) => (
          <button key={r.key} className="opt" onClick={() => onPick(r.key)} style={{ alignItems: 'flex-start' }}>
            <span className="k">{i + 1}</span>
            <span>
              <span style={{ display: 'block' }}>{r.label}</span>
              <span style={{ display: 'block', fontSize: '.82rem', color: 'var(--mute-d)' }}>{r.note}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="actionbar" style={{ marginTop: '1.5rem' }}>
        <button className="btn btn-ghost" onClick={onBack}>
          {t(UI.back, lang)}
        </button>
        <span className="saved" />
      </div>
    </main>
  );
}
