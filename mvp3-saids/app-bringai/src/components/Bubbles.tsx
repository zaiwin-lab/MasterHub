import { useState } from 'react';
import type { Lang } from '../types';
import { UI, t } from '../i18n/dict';
import { whatsappConfigured, whatsappUrl } from '../lib/capture';

/**
 * The KOBIS house trademark: assistant bubble bottom-left, WhatsApp bottom-right.
 *
 * The assistant is scripted, not a live model, and says so on the panel. Five
 * prepared answers to the questions people actually ask. Nothing here calls out.
 */
export default function Bubbles({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="assistant-panel" role="dialog" aria-label={t(UI.assistantName, lang)}>
          <div className="ph">
            <div>
              <strong>{t(UI.assistantName, lang)}</strong>
              <div className="scripted">{t(UI.assistantScripted, lang)}</div>
            </div>
            <button className="x" onClick={() => setOpen(false)} aria-label={t(UI.assistantClose, lang)}>
              ✕
            </button>
          </div>
          <div className="qa">
            {UI.assistantQA.map(([q, a], i) => (
              <details key={i}>
                <summary>{t(q, lang)}</summary>
                <p>{t(a, lang)}</p>
              </details>
            ))}
          </div>
        </div>
      )}

      <div className="bubbles">
        <button
          className="bub-assistant"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={t(UI.assistantName, lang)}
        >
          <span className="av" aria-hidden="true">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="7" width="18" height="13" rx="3" />
              <path d="M12 7V4M8 13h.01M16 13h.01M9 17h6" strokeLinecap="round" />
            </svg>
          </span>
          <span className="tx">
            <span className="nm">{t(UI.assistantName, lang)}</span>
            <span className="tg">{t(UI.assistantTag, lang)}</span>
          </span>
        </button>

        {whatsappConfigured ? (
          <a
            className="bub-wa"
            href={whatsappUrl(`Hi KOBIS — I'm on the AI Readiness Scan and have a question.`)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t(UI.ctaWhatsapp, lang)}
          >
            <WaIcon />
          </a>
        ) : (
          /* No number configured yet, so the bubble holds its place without
             pretending to dial anyone. */
          <span className="bub-wa" style={{ opacity: 0.4 }} aria-hidden="true">
            <WaIcon />
          </span>
        )}
      </div>
    </>
  );
}

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.09 3.2 5.07 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 8.23 8.24c0 4.54-3.7 8.23-8.23 8.23z" />
    </svg>
  );
}
