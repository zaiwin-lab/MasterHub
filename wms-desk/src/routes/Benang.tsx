import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLang } from '../store/useLang'
import { useBenang } from '../store/useBenang'
import { t } from '../lib/i18n'
import { rm } from '../lib/format'
import { REFERRAL_CAP, REFERRAL_RATE } from '../lib/quote'
import { AMBASSADOR_SEED, isPlannerCode } from '../lib/referral'
import { Ledger, Presence, Tapestry } from '../components/BenangBits'
import { ShareKit } from '../components/ShareKit'
import { Field } from '../components/ContactFields'

export function Benang() {
  const { lang } = useLang()
  const [params] = useSearchParams()
  const benang = useBenang()

  const paramCode = (params.get('kod') ?? params.get('code') ?? '').toUpperCase()
  const [active, setActive] = useState(
    () => paramCode || benang.mine?.code || AMBASSADOR_SEED[0].code,
  )

  useEffect(() => {
    if (paramCode && benang.find(paramCode)) setActive(paramCode)
  }, [paramCode, benang])

  const amb = benang.find(active)
  const funnel = benang.funnel(active)
  const planner = isPlannerCode(active)

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="display text-[clamp(28px,4.6vw,44px)] leading-tight">
          {t('benangTitle', lang)}
        </h1>
        <p className="text-[15px] text-inksoft">{t('benangTag', lang)}</p>
      </div>

      <p className="mt-2 max-w-[46rem] text-[14px] text-inksoft">
        {lang === 'bm'
          ? `Setiap benang bermula dengan satu jemputan. Kawan anda dapat potongan ${
              REFERRAL_RATE * 100
            }% daripada harga pakej semasa, had ${rm(REFERRAL_CAP, lang)}. Anda kumpul kredit apabila kakitangan sahkan majlis mereka.`
          : `Every thread starts with one invitation. Your friends take ${
              REFERRAL_RATE * 100
            }% off the current package price, capped at ${rm(
              REFERRAL_CAP,
              lang,
            )}. You collect credit once staff confirm their booking.`}
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {benang.directory.map((a) => (
          <button
            key={a.code}
            onClick={() => setActive(a.code)}
            aria-pressed={active === a.code}
            className={`ctl min-h-[44px] px-3 border text-[13px] transition-colors duration-150 ${
              active === a.code ? 'border-ink bg-ink text-paper' : 'border-ink/25 hover:border-ink'
            }`}
          >
            {a.name}
            <span className="ml-2 tnum opacity-70">{a.code}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid lg:grid-cols-[56fr_44fr] gap-8 items-start">
        <div className="sheet p-5 self-start">
          <div className="flex items-baseline justify-between gap-3">
            <span className="display text-[19px]">{amb?.name ?? active}</span>
            <Presence code={active} />
          </div>

          <div className="mt-2">
            <Tapestry code={active} />
          </div>

          <div className="grid grid-cols-4 gap-2 border-t border-ink/12 pt-3">
            {(
              [
                ['view', lang === 'bm' ? 'Lihat' : 'Views'],
                ['draft', lang === 'bm' ? 'Draf' : 'Drafts'],
                ['hold', lang === 'bm' ? 'Ditahan' : 'Holds'],
                ['confirm', lang === 'bm' ? 'Disahkan' : 'Confirmed'],
              ] as const
            ).map(([k, label]) => (
              <div key={k}>
                <div className="tnum display text-[24px] leading-none">{funnel[k]}</div>
                <div className="text-[11.5px] text-inksoft">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            <button
              onClick={() => benang.confirmOne(active)}
              disabled={funnel.hold <= funnel.confirm}
              className="ctl min-h-[44px] px-3 border border-copper text-copperhot text-[13px] hover:bg-copper/10 disabled:opacity-40 disabled:hover:bg-transparent transition-colors duration-150"
            >
              {t('staffSim', lang)}
            </button>
            <Link
              to={`/tempah?benang=${active}`}
              className="ctl min-h-[44px] px-3 inline-flex items-center border border-ink/25 hover:border-ink text-[13px] transition-colors duration-150"
            >
              {lang === 'bm' ? 'Buka desk dengan kod ini' : 'Open the desk with this code'}
            </Link>
          </div>

          {planner && (
            <p className="mt-3 text-[12.5px] text-inksoft">{t('benangPlanner', lang)}</p>
          )}
        </div>

        <div className="grid gap-6 content-start">
          {!planner && (
            <div className="sheet p-5">
              <Ledger code={active} />
            </div>
          )}

          <div className="sheet p-5">
            <div className="text-[12px] uppercase tracking-[0.16em] text-inksoft">
              {lang === 'bm' ? 'Kit kongsi' : 'Share kit'}
            </div>
            <div className="mt-3">
              <ShareKit code={active} name={amb?.name ?? active} />
            </div>
          </div>

          <MintPanel />
        </div>
      </div>

      <p className="mt-6 text-[12.5px] text-inksoft max-w-[46rem]">
        {lang === 'bm'
          ? 'Satu kod setiap tempahan. Kod sendiri dan nombor telefon yang sama dengan pemilik kod tidak diterima.'
          : 'One code per booking. Your own code, or a phone matching the code owner, is not accepted.'}
      </p>
    </div>
  )
}

function MintPanel() {
  const { lang } = useLang()
  const benang = useBenang()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const mine = benang.mine

  const inputCls =
    'w-full ctl border border-ink/25 bg-paper px-3 min-h-[44px] text-[15px] placeholder:text-inksoft/50 focus:border-ink transition-colors duration-150'

  if (mine) return null

  return (
    <div className="sheet p-5">
      <div className="text-[12px] uppercase tracking-[0.16em] text-inksoft">
        {lang === 'bm' ? 'Buka benang anda' : 'Open your thread'}
      </div>
      <div className="mt-3 grid gap-3">
        <Field label={lang === 'bm' ? 'Nama' : 'Name'}>
          <input
            className={inputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={lang === 'bm' ? 'Aina & Hafiz' : 'Aina & Hafiz'}
          />
        </Field>
        <Field label={lang === 'bm' ? 'Telefon' : 'Phone'}>
          <input
            className={inputCls}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="011-2233 4455"
            inputMode="tel"
          />
        </Field>
        <button
          onClick={() => benang.mint(name.trim(), phone.trim())}
          disabled={name.trim().length < 2}
          className="ctl bg-ink text-paper min-h-[46px] px-4 text-[14px] disabled:bg-ink/10 disabled:text-inksoft hover:bg-black transition-colors duration-150"
        >
          {t('mintCta', lang)}
        </button>
      </div>
    </div>
  )
}
