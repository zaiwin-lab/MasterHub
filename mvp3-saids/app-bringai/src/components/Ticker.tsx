import type { Lang } from '../types';
import { TICKER } from '../data/proof';
import { t } from '../i18n/dict';

/**
 * The KOBIS house signature ticker, carrying urgency lines rather than a credit.
 * Content is repeated once and the track translated -50%, so the loop is seamless.
 * Paused entirely under prefers-reduced-motion (see index.css).
 */
export default function Ticker({ lang }: { lang: Lang }) {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {items.map((line, i) => (
          <span className="ticker-item" key={i}>
            {t(line, lang)}
          </span>
        ))}
      </div>
    </div>
  );
}
