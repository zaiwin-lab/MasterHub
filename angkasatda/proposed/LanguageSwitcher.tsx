/**
 * LanguageSwitcher — EN · BM · 中文 · Iban
 *
 * Reuses the language context the app already has (persisted under
 * `attendify:lang`, which already accepts en | bm | zh | iban and sets
 * document.documentElement.lang). This component only calls setLang —
 * it deliberately does not introduce a second source of truth.
 *
 * Adjust the import below to wherever useLang() actually lives.
 */
import { useLang } from "../i18n";

export const LANGS = [
  { code: "en", label: "EN", name: "English" },
  { code: "bm", label: "BM", name: "Bahasa Melayu" },
  { code: "zh", label: "中文", name: "中文" },
  { code: "iban", label: "Iban", name: "Jaku Iban" },
] as const;

export type LangCode = (typeof LANGS)[number]["code"];

/** BCP-47 tag for the `lang` attribute on each button. */
function htmlLang(code: LangCode) {
  if (code === "zh") return "zh";
  if (code === "en") return "en";
  return "ms"; // bm and iban both sit under ms for the browser's purposes
}

type Props = {
  /** Set when the switcher sits on the navy header rather than a light surface. */
  onDark?: boolean;
  className?: string;
};

export function LanguageSwitcher({ onDark = false, className = "" }: Props) {
  const { lang, setLang } = useLang();

  const track = onDark
    ? "bg-white/10 border-white/20"
    : "bg-navy-50 border-navy-100";

  return (
    <div
      role="group"
      aria-label="Select language"
      className={`inline-flex items-center gap-0.5 rounded-full border p-1 ${track} ${className}`}
    >
      {LANGS.map(({ code, label, name }) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            lang={htmlLang(code)}
            title={name}
            aria-current={active}
            onClick={() => setLang(code)}
            className={[
              "rounded-full px-3.5 py-1.5 text-[13px] font-semibold leading-none",
              "whitespace-nowrap transition-colors",
              "focus-visible:outline focus-visible:outline-2",
              "focus-visible:outline-offset-2 focus-visible:outline-gold-500",
              code === "zh" && "font-cjk",
              active
                ? onDark
                  ? "bg-white text-navy-900"
                  : "bg-navy-900 text-white shadow-sm"
                : onDark
                  ? "text-navy-200 hover:bg-white/10 hover:text-white"
                  : "text-navy-600 hover:bg-navy-100 hover:text-navy-900",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
