/**
 * Deterministic scoring & report generation.
 *
 * Committee scores (1–5 across seven criteria) roll up to a percentage, a
 * recommendation band, and a templated executive report. Every output is
 * rule-based and explainable — no backend, no AI.
 */

import { CRITERIA } from './constants';

export type Band = 'recommended' | 'clarify' | 'revise' | 'reject';

export interface BandInfo {
  band: Band;
  label: string;
}

export interface Report {
  percent: number;
  band: Band;
  bandLabel: string;
  strengths: string[];
  clarifications: string[];
  remarks: string;
  nextAction: string;
}

const MAX_TOTAL = CRITERIA.length * 5; // 35

export function bandFor(percent: number): BandInfo {
  if (percent >= 85) return { band: 'recommended', label: 'Recommended' };
  if (percent >= 70) return { band: 'clarify', label: 'Recommended with Clarification' };
  if (percent >= 50) return { band: 'revise', label: 'Needs Revision' };
  return { band: 'reject', label: 'Not Recommended' };
}

export function percentFor(scores: Record<string, number>): number {
  const total = CRITERIA.reduce((sum, c) => sum + (scores[c.key] ?? 0), 0);
  return Math.round((total / MAX_TOTAL) * 100);
}

const REMARKS: Record<Band, (title: string, ngo: string) => string> = {
  recommended: (title, ngo) =>
    `The Committee finds "${title}" submitted through ${ngo} to be a well-prepared programme that meets the BizFund2 evaluation framework across all key dimensions. The submission demonstrates clear objectives, credible delivery capability and a sound budget position.`,
  clarify: (title, ngo) =>
    `The Committee views "${title}" submitted through ${ngo} favourably overall. The programme meets most evaluation criteria; however, a small number of items require clarification before final endorsement can be given.`,
  revise: (title, ngo) =>
    `The Committee has reviewed "${title}" submitted through ${ngo} and finds that the proposal requires revision in several areas before it can be considered for support. The applicant is encouraged to address the items listed above and resubmit.`,
  reject: (title, ngo) =>
    `Following assessment against the BizFund2 evaluation framework, the Committee is unable to recommend "${title}" submitted through ${ngo} in its current form. Fundamental gaps were identified across multiple criteria.`,
};

const NEXT_ACTIONS: Record<Band, string> = {
  recommended: 'Table for endorsement at the next Committee meeting and proceed to funding confirmation.',
  clarify: 'Request written clarification from the training provider on the items above, then table for endorsement.',
  revise: 'Return to the applicant with the revision points above and invite resubmission in the current cycle.',
  reject: 'Notify the applicant with feedback and invite a substantially revised proposal in the next funding cycle.',
};

export function buildReport(scores: Record<string, number>): Report {
  const percent = percentFor(scores);
  const { band, label } = bandFor(percent);

  const strengths = CRITERIA.filter((c) => (scores[c.key] ?? 0) >= 4).map((c) => c.strength);
  const clarifications = CRITERIA.filter((c) => (scores[c.key] ?? 0) <= 3).map((c) => c.clarify);

  return {
    percent,
    band,
    bandLabel: label,
    strengths: strengths.length
      ? strengths
      : ['No standout strengths recorded — refer to individual criterion scores.'],
    clarifications: clarifications.length
      ? clarifications
      : ['No items requiring clarification — all criteria scored Good or above.'],
    remarks: '', // filled by caller with title/ngo context via remarksFor
    nextAction: NEXT_ACTIONS[band],
  };
}

export function remarksFor(band: Band, title: string, ngo: string): string {
  return REMARKS[band](title || 'the proposed programme', ngo || 'the applicant association');
}
