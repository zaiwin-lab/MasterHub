/** Every user-facing string is a tuple ordered [en, bm, zh, ib] — the KOBIS house
 *  four-language pattern. A missing cell falls back to English rather than
 *  rendering blank, so a partial translation degrades instead of breaking. */
export type L = readonly [string, string, string?, string?];

export type Lang = 'en' | 'bm' | 'zh' | 'ib';

export type RespondentType = 'owner' | 'executive' | 'founder';

export type QuestionType = 'single' | 'multi' | 'scale' | 'segmented' | 'select' | 'slider';

export type SectionId =
  | 'profile'
  | 'offer'
  | 'demand'
  | 'operations'
  | 'digital'
  | 'ai'
  | 'potential'
  | 'decision';

export interface Option {
  value: string;
  label: L;
}

export interface Question {
  id: string;
  section: SectionId;
  text: L;
  help?: L;
  type: QuestionType;
  options?: Option[];
  scale?: { min: number; max: number; minLabel: L; maxLabel: L };
  /** Shown only to these respondent types. Omitted means shown to all. */
  showFor?: RespondentType[];
  /** Adds a "Not sure" escape hatch. */
  allowNotSure?: boolean;
  /** Adds a "Prefer not to say" escape hatch. Used on money questions. */
  allowDecline?: boolean;
  /** Cap on multi-select. */
  maxSelect?: number;
  /** Reassurance line rendered under the control, not in a tooltip. */
  note?: L;
}

export type AnswerValue = string | string[] | number;
export type Answers = Record<string, AnswerValue>;

export const NOT_SURE = '__not_sure__';
export const DECLINED = '__declined__';

export type AssetPlatform =
  | 'website'
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'linkedin'
  | 'youtube'
  | 'google_business'
  | 'shopee'
  | 'lazada'
  | 'whatsapp'
  | 'other';

export interface DetectedAsset {
  id: string;
  platform: AssetPlatform;
  raw: string;
  url: string;
  /** The browser cannot fetch third-party pages, so nothing is ever verified here. */
  verification: 'declared';
}

export interface BusinessContext {
  description: string;
  customers: string;
  proud: string;
}

export interface Consents {
  research: boolean;
  reportEmail: boolean;
  futureComms: boolean;
  version: string;
  timestampIso: string | null;
}

export type Classification = 'fact' | 'inference' | 'recommendation' | 'limitation';

export type LensKey = 'build_readiness' | 'hidden_potential' | 'market_pull';

export interface DimensionScore {
  key: string;
  label: L;
  lens: LensKey;
  weight: number;
  /** null means insufficient data — never rendered as zero. */
  score: number | null;
  evidence: L[];
}

export type LeakCode = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6';

export interface Leak {
  code: LeakCode;
  name: L;
  /** null when the inputs needed were skipped or declined. */
  amount: number | null;
  /** Opportunity leaks are shown but never summed into the headline figure. */
  kind: 'loss' | 'opportunity' | 'qualitative';
  why: L;
  fix: L;
  /** Human-readable arithmetic with the respondent's own inputs substituted in. */
  workings: L | null;
}

export interface Snapshot {
  scan_id: string;
  instrument_version: string;
  scoring_version: string;
  generated_at: string;
  language: Lang;
  respondent_type: RespondentType;
  mvp3_index: number;
  band_key: string;
  band_label: L;
  band_note: L;
  lens_scores: Record<LensKey, number | null>;
  dimension_scores: DimensionScore[];
  leaks: Leak[];
  total_monthly_leak: number | null;
  leak_capped: boolean;
  cost_of_delay_90: number | null;
  mvp3_candidate: {
    key: string;
    name: L;
    what: L;
    window: L;
  };
  first_seven: { action: L; why: L }[];
  next_moves: { horizon: L; action: L }[];
  confidence: 'low' | 'moderate' | 'good';
  evidence_coverage: number;
  assets_submitted: number;
  assets_reviewed: number;
  limitations: L[];
  classifications: Record<string, Classification>;
}
