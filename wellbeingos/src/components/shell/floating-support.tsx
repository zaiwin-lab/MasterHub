'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, MessageCircleQuestion, Sparkles, X } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { useT } from '@/lib/use-t';
import { cn } from '@/lib/utils';

/** WhatsApp's glyph is a brand mark, so it is drawn rather than approximated. */
function WhatsAppGlyph({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.174.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.896 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

/**
 * The two persistent assistance controls.
 *
 * They are deliberately pinned to opposite corners: the assistant on the left
 * where it never covers a primary action, WhatsApp on the right where a
 * messaging button is conventionally expected. Both sit above the safe-area
 * inset so neither is trapped under a phone's home indicator.
 */
export function FloatingSupport() {
  const { config } = useStore();
  const t = useT();
  const [open, setOpen] = useState(false);
  const [asked, setAsked] = useState<number | null>(null);
  const s = config.support;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const waHref = `https://wa.me/${s.whatsappNumber}?text=${encodeURIComponent(s.whatsappPrefill)}`;
  const answer = asked === null ? null : s.assistantPrompts[asked];

  return (
    <>
      {/* ---------------------------------------------- Bottom-left: AI Help */}
      <div className="fab-left fixed bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 no-print">
        {open ? (
          <div
            role="dialog"
            aria-modal="false"
            aria-label={s.assistantName}
            className="mb-3 flex max-h-[min(30rem,70vh)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-lift animate-fade-up"
          >
            <div className="flex items-start justify-between gap-3 border-b border-line bg-gradient-to-r from-brand/[0.12] to-violet/[0.10] px-4 py-3.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand to-violet text-white">
                  <Sparkles size={17} aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-semibold text-head">{t('assist.title')}</p>
                  <p className="truncate text-[11.5px] text-ink-muted">{t('assist.subtitle')}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label={t('app.close')}
                className="-mr-1 rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-tint/[0.08] hover:text-head"
              >
                <X size={16} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              {answer ? (
                <div className="animate-fade-in">
                  <p className="rounded-2xl rounded-br-sm bg-brand/[0.10] px-3.5 py-2.5 text-[13px] font-medium text-head">
                    {answer.question}
                  </p>
                  <p className="mt-2.5 rounded-2xl rounded-bl-sm border border-line bg-raised px-3.5 py-3 text-[13px] leading-relaxed text-ink">
                    {answer.answer}
                  </p>
                  <button
                    onClick={() => setAsked(null)}
                    className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-brand hover:underline"
                  >
                    <ArrowLeft size={13} /> {t('assist.another')}
                  </button>
                </div>
              ) : (
                <>
                  <p className="label mb-2.5">{t('assist.pick')}</p>
                  <ul className="space-y-1.5">
                    {s.assistantPrompts.map((p, i) => (
                      <li key={p.question}>
                        <button
                          onClick={() => setAsked(i)}
                          className="w-full rounded-xl border border-line bg-raised px-3.5 py-2.5 text-left text-[13px] leading-snug text-ink transition-colors hover:border-brand/40 hover:bg-brand/[0.06] hover:text-head"
                        >
                          {p.question}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="border-t border-line bg-canvas/60 px-4 py-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[12.5px] font-medium text-brand hover:underline"
              >
                <MessageCircleQuestion size={14} /> {t('assist.escalate')}
              </a>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-soft">{t('assist.disclaimer')}</p>
            </div>
          </div>
        ) : null}

        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={t('assist.open')}
          className={cn(
            'group inline-flex h-12 items-center gap-2.5 rounded-full border border-brand/30 bg-surface pl-2 pr-4 shadow-lift transition-all hover:border-brand/60 hover:shadow-glow',
            open && 'border-brand/60',
          )}
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-violet text-white">
            <Sparkles size={16} aria-hidden />
          </span>
          <span className="whitespace-nowrap text-[13px] font-semibold text-head">{s.assistantName}</span>
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
          </span>
        </button>
      </div>

      {/* -------------------------------------------- Bottom-right: WhatsApp */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={s.whatsappLabel}
        className="group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 flex items-center gap-2 no-print sm:right-6"
      >
        <span className="pointer-events-none hidden max-w-0 overflow-hidden whitespace-nowrap rounded-full border border-line bg-surface px-0 py-1.5 text-[12.5px] font-medium text-head opacity-0 shadow-card transition-all duration-300 group-hover:max-w-[12rem] group-hover:px-3.5 group-hover:opacity-100 sm:inline-block">
          {s.whatsappLabel}
        </span>
        <span className="grid h-[52px] w-[52px] place-items-center rounded-full text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.65)] transition-transform group-hover:scale-105" style={{ backgroundColor: '#25D366' }}>
          <WhatsAppGlyph size={27} />
        </span>
      </a>
    </>
  );
}
