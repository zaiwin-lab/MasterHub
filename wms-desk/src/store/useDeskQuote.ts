import { useMemo } from 'react'
import { useDesk } from './useDesk'
import { useBenang } from './useBenang'
import { computeQuote, type Quote } from '../lib/quote'
import { validateReferral, type ReferralCheck } from '../lib/referral'

export type DeskQuote = {
  quote: Quote
  ref: ReferralCheck
  /** Duta credit available to the visitor from their own confirmed referrals. */
  availableCredit: number
  dutaTier: number
}

/**
 * One place resolves the referral code, the duta credit and the quote, so the
 * header mini-total, the desk, the stage and the WhatsApp brief cannot drift.
 */
export function useDeskQuote(): DeskQuote {
  const desk = useDesk()
  const benang = useBenang()

  const mineCode = benang.mine?.code
  const own = mineCode ? benang.creditOf(mineCode) : { credit: 0, tier: 0, confirmed: 0 }

  const ref = useMemo(
    () =>
      validateReferral(desk.benang, {
        ownCode: mineCode ?? null,
        phone: desk.phone,
        directory: benang.directory,
      }),
    [desk.benang, desk.phone, mineCode, benang.directory],
  )

  const credit = desk.useCredit ? own.credit : 0

  const quote = useMemo(
    () =>
      computeQuote({
        pkg: desk.pkg,
        pax: desk.pax,
        referralApplied: ref.ok && ref.appliesCash,
        credit,
        dutaTier: own.tier,
      }),
    [desk.pkg, desk.pax, ref.ok, ref.appliesCash, credit, own.tier],
  )

  return { quote, ref, availableCredit: own.credit, dutaTier: own.tier }
}
