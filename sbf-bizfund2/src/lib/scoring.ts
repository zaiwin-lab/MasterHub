/**
 * Deterministic scoring & report generation.
 *
 * Committee scores (1–5 across eight criteria) roll up to a percentage, a
 * recommendation band, and the keys needed to build a templated report.
 * Every output is rule-based and explainable — no backend, no AI. Display
 * text is resolved per-language in the components via the i18n dictionary.
 */

import { CRITERION_KEYS } from './constants';

export type Band = 'recommended' | 'clarify' | 'revise' | 'reject';

export interface Report {
  percent: number;
  band: Band;
  /** Criterion keys scoring ≥ 4 (strengths) and ≤ 3 (need clarification). */
  strengthKeys: string[];
  clarifyKeys: string[];
}

const MAX_TOTAL = CRITERION_KEYS.length * 5; // 40

export function bandFor(percent: number): Band {
  if (percent >= 85) return 'recommended';
  if (percent >= 70) return 'clarify';
  if (percent >= 50) return 'revise';
  return 'reject';
}

export function percentFor(scores: Record<string, number>): number {
  const total = CRITERION_KEYS.reduce((sum, k) => sum + (scores[k] ?? 0), 0);
  return Math.round((total / MAX_TOTAL) * 100);
}

export function buildReport(scores: Record<string, number>): Report {
  const percent = percentFor(scores);
  return {
    percent,
    band: bandFor(percent),
    strengthKeys: CRITERION_KEYS.filter((k) => (scores[k] ?? 0) >= 4),
    clarifyKeys: CRITERION_KEYS.filter((k) => (scores[k] ?? 0) <= 3),
  };
}

/** Fill {title} / {ngo} placeholders in a remarks template. */
export function fillRemarks(template: string, title: string, ngo: string): string {
  return template.replace('{title}', title).replace('{ngo}', ngo);
}
