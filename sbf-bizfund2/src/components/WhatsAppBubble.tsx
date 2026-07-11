import { useI18n } from '../lib/i18n/context';
import { whatsappLink } from '../lib/site';

/** Simple WhatsApp brand glyph (inline SVG so no external asset is needed). */
function WhatsAppIcon({ size = 26 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M16.003 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.257.59 4.463 1.71 6.406L3.2 28.8l6.57-1.723a12.74 12.74 0 0 0 6.23 1.62h.005c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.332-6.635-3.75-9.053A12.72 12.72 0 0 0 16.003 3.2Zm0 23.34h-.004a10.6 10.6 0 0 1-5.4-1.48l-.388-.23-4.03 1.057 1.076-3.928-.253-.403a10.55 10.55 0 0 1-1.62-5.636c0-5.86 4.77-10.63 10.63-10.63 2.84 0 5.51 1.106 7.52 3.115a10.56 10.56 0 0 1 3.114 7.52c0 5.86-4.77 10.63-10.63 10.63Zm5.83-7.96c-.32-.16-1.89-.933-2.183-1.04-.293-.107-.507-.16-.72.16-.213.32-.826 1.04-1.013 1.253-.187.213-.373.24-.693.08-.32-.16-1.35-.498-2.57-1.586-.95-.847-1.59-1.893-1.777-2.213-.187-.32-.02-.493.14-.653.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.986-2.373-.26-.623-.523-.54-.72-.55l-.613-.01c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667 0 1.573 1.147 3.093 1.307 3.307.16.213 2.253 3.44 5.46 4.827.763.33 1.36.526 1.824.673.767.244 1.464.21 2.016.127.615-.092 1.89-.773 2.157-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373Z" />
    </svg>
  );
}

export default function WhatsAppBubble() {
  const { t } = useI18n();
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsapp.label}
      className="no-print group fixed bottom-5 right-5 z-50 flex items-center gap-2"
    >
      <span className="hidden rounded-full bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white shadow-card group-hover:block">
        {t.whatsapp.label}
      </span>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card transition hover:scale-105">
        <WhatsAppIcon />
      </span>
    </a>
  );
}
