import { useLang } from '../store/useLang'
import { t } from '../lib/i18n'
import { COORDINATORS, VENUE } from '../lib/venue'
import { waLink } from '../lib/whatsapp'

export function Hubungi() {
  const { lang } = useLang()

  const visitText =
    lang === 'bm'
      ? `Assalamualaikum. Saya ingin melawat ${VENUE.hall} di Petra Jaya. Bilakah masa yang sesuai?`
      : `Assalamualaikum. I would like to visit ${VENUE.hall} in Petra Jaya. When would suit?`

  return (
    <div className="mx-auto max-w-[880px] px-4 sm:px-6 py-8">
      <h1 className="display text-[clamp(28px,4.6vw,44px)] leading-tight">{t('navHubungi', lang)}</h1>

      <div className="mt-7 grid sm:grid-cols-2 gap-8">
        <div>
          <div className="text-[12px] uppercase tracking-[0.16em] text-inksoft">
            {lang === 'bm' ? 'Penyelaras' : 'Coordinators'}
          </div>
          <div className="mt-2 border-t border-ink/12">
            {COORDINATORS.map((c) => (
              <div key={c.wa} className="py-3 border-b border-ink/12">
                <div className="display text-[17px]">{c.name}</div>
                <div className="tnum text-[13px] text-inksoft">{c.phone}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <a
                    href={`https://wa.me/${c.wa}`}
                    target="_blank"
                    rel="noreferrer"
                    className="ctl bg-ink text-paper px-3 min-h-[44px] inline-flex items-center text-[13px] hover:bg-black transition-colors duration-150"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={waLink(c.wa, visitText)}
                    target="_blank"
                    rel="noreferrer"
                    className="ctl border border-ink/25 px-3 min-h-[44px] inline-flex items-center text-[13px] hover:border-ink transition-colors duration-150"
                  >
                    {lang === 'bm' ? 'Mohon lawatan' : 'Request a visit'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[12px] uppercase tracking-[0.16em] text-inksoft">
            {lang === 'bm' ? 'Pejabat' : 'Office'}
          </div>
          <div className="mt-2 text-[14px] grid gap-1">
            <span className="tnum">{VENUE.officePhone}</span>
            <span className="tnum">{VENUE.officeMobile}</span>
            <a href={`mailto:${VENUE.officeEmail}`} className="underline-copper break-all">
              {VENUE.officeEmail}
            </a>
            <a href={`mailto:${VENUE.bookingEmail}`} className="underline-copper break-all">
              {VENUE.bookingEmail}
            </a>
            <a href={VENUE.site} target="_blank" rel="noreferrer" className="underline-copper">
              melayusarawak.org.my
            </a>
          </div>

          <div className="mt-6 text-[12px] uppercase tracking-[0.16em] text-inksoft">
            {lang === 'bm' ? 'Alamat' : 'Address'}
          </div>
          <p className="mt-2 text-[14px] text-inksoft">{VENUE.address}</p>
          <a href={VENUE.maps} target="_blank" rel="noreferrer" className="mt-2 inline-block underline-copper text-[14px]">
            {lang === 'bm' ? 'Buka peta' : 'Open map'}
          </a>

          <p className="mt-6 text-[12.5px] text-inksoft">
            {lang === 'bm'
              ? 'Deposit diuruskan oleh kakitangan melalui WhatsApp. Tiada pembayaran di laman ini.'
              : 'Deposits are arranged by staff over WhatsApp. No payment is taken on this site.'}
          </p>
        </div>
      </div>
    </div>
  )
}
