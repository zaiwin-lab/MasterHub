import { useEffect, useRef, useState } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { useI18n } from '../lib/i18n/context';

interface Msg {
  from: 'staff' | 'user';
  text: string;
}

export default function DigitalStaff() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Seed / reset the greeting whenever the language changes.
  useEffect(() => {
    setMessages([{ from: 'staff', text: t.staff.greeting }]);
  }, [lang, t.staff.greeting]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const answerFor = (question: string): string => {
    const found = t.staff.quickReplies.find((r) => r.q === question);
    if (found) return found.a;
    // Fallback: light keyword match, else the "coming soon" note.
    const lc = question.toLowerCase();
    const kw = t.staff.quickReplies.find((r) =>
      lc.split(/\s+/).some((w) => w.length > 3 && r.q.toLowerCase().includes(w)),
    );
    return kw ? kw.a : t.staff.comingSoon;
  };

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((m) => [...m, { from: 'user', text: clean }]);
    setDraft('');
    window.setTimeout(() => {
      setMessages((m) => [...m, { from: 'staff', text: answerFor(clean) }]);
    }, 350);
  };

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t.staff.open}
        className="no-print fixed bottom-5 left-5 z-50 flex items-center gap-2.5 rounded-full bg-navy-800 py-2 pl-2 pr-4 text-white shadow-card transition hover:scale-105"
      >
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-teal-500">
          <Bot size={20} />
          <span className="absolute -right-0 -top-0 h-3 w-3 rounded-full border-2 border-navy-800 bg-emerald-400" />
        </span>
        <span className="text-left leading-tight">
          <span className="block text-sm font-bold">{t.staff.name}</span>
          <span className="block text-[10px] font-medium text-white/70">{t.staff.tagline}</span>
        </span>
      </button>

      {/* Panel */}
      {open && (
        <div className="no-print fixed bottom-24 left-5 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
          <div className="flex items-center gap-3 bg-navy-800 px-4 py-3 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500">
              <Bot size={18} />
            </span>
            <div className="flex-1 leading-tight">
              <p className="text-sm font-bold">{t.staff.name}</p>
              <p className="text-[10px] text-white/70">{t.staff.tagline}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded-lg p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-navy-50/40 px-3.5 py-4">
            {messages.map((m, i) => (
              <div key={i} className={m.from === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <span
                  className={[
                    'max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
                    m.from === 'user'
                      ? 'rounded-br-sm bg-navy-800 text-white'
                      : 'rounded-bl-sm bg-white text-ink/80 shadow-soft',
                  ].join(' ')}
                >
                  {m.text}
                </span>
              </div>
            ))}

            {/* Quick replies */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {t.staff.quickReplies.map((r) => (
                <button
                  key={r.q}
                  type="button"
                  onClick={() => send(r.q)}
                  className="rounded-full border border-navy-200 bg-white px-3 py-1 text-xs font-medium text-navy-700 transition hover:border-teal-400 hover:text-teal-700"
                >
                  {r.q}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
            className="flex items-center gap-2 border-t border-navy-100 bg-white px-3 py-2.5"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t.staff.inputPlaceholder}
              className="field-input !py-2 text-sm"
            />
            <button
              type="submit"
              aria-label="Send"
              className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-navy-800 text-white transition hover:bg-navy-900"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
