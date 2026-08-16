import { useState } from 'react';
import type { BusinessContext, DetectedAsset, Lang } from '../types';
import { detectAssets, platformLabel } from '../lib/magicbox';
import { Field } from '../components/ui';
import { UI, fill, t } from '../i18n/dict';

export default function MagicBox({
  lang,
  assets,
  setAssets,
  context,
  setContext,
  onDone,
  onBack,
}: {
  lang: Lang;
  assets: DetectedAsset[];
  setAssets: (a: DetectedAsset[]) => void;
  context: BusinessContext;
  setContext: (c: BusinessContext) => void;
  onDone: () => void;
  onBack: () => void;
}) {
  const [raw, setRaw] = useState('');

  const detect = () => {
    const found = detectAssets(raw);
    const existing = new Set(assets.map((a) => a.url.toLowerCase()));
    setAssets([...assets, ...found.filter((f) => !existing.has(f.url.toLowerCase()))]);
    setRaw('');
  };

  return (
    <main className="shell" style={{ paddingBlock: '2.2rem' }}>
      <span className="eyebrow">{t(UI.brand, lang)}</span>
      <h1 style={{ fontSize: '1.6rem', marginTop: '.5rem' }}>{t(UI.mbTitle, lang)}</h1>
      <p style={{ marginTop: '.7rem', color: 'var(--ink-soft)', maxWidth: '48ch' }}>{t(UI.mbBody, lang)}</p>

      <Field label={t(UI.mbTitle, lang)}>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder={t(UI.mbPlaceholder, lang)}
          rows={5}
        />
      </Field>
      <div style={{ marginTop: '.8rem', display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
        <button className="btn btn-ghost" onClick={detect} disabled={!raw.trim()}>
          {t(UI.mbDetect, lang)}
        </button>
      </div>

      {assets.length > 0 && (
        <>
          <p style={{ marginTop: '1.3rem', fontSize: '.8rem', color: 'var(--ink-mute)' }} className="mono">
            {fill(t(UI.mbFound, lang), { n: assets.length })}
          </p>
          <div className="assets">
            {assets.map((a) => (
              <div className="asset" key={a.id}>
                <span className="plat">{t(platformLabel(a.platform), lang)}</span>
                <span className="url">{a.url}</span>
                <button onClick={() => setAssets(assets.filter((x) => x.id !== a.id))}>{t(UI.mbRemove, lang)}</button>
              </div>
            ))}
          </div>
          <p className="qnote" style={{ marginTop: '.9rem' }}>
            {t(UI.mbDeclared, lang)}
          </p>
        </>
      )}

      <div style={{ borderTop: '1px solid var(--rule)', marginTop: '1.8rem', paddingTop: '1.2rem' }}>
        <Field label={t(UI.ctxDescription, lang)} hint={t(UI.optional, lang)}>
          <textarea
            value={context.description}
            onChange={(e) => setContext({ ...context, description: e.target.value })}
            rows={3}
          />
        </Field>
        <Field label={t(UI.ctxCustomers, lang)} hint={t(UI.optional, lang)}>
          <textarea
            value={context.customers}
            onChange={(e) => setContext({ ...context, customers: e.target.value })}
            rows={2}
          />
        </Field>
        <Field label={t(UI.ctxProud, lang)} hint={t(UI.optional, lang)}>
          <textarea value={context.proud} onChange={(e) => setContext({ ...context, proud: e.target.value })} rows={2} />
        </Field>
      </div>

      <div className="actionbar" style={{ marginTop: '1.6rem' }}>
        <button className="btn btn-ghost" onClick={onBack}>
          ← {t(UI.back, lang)}
        </button>
        <button className="btn" onClick={onDone}>
          {assets.length === 0 && !context.description ? t(UI.mbSkip, lang) : t(UI.next, lang)} →
        </button>
      </div>
    </main>
  );
}
