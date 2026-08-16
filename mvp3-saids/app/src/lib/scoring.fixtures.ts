/**
 * Hand-verified scoring fixtures. The scoring is the product, so a silent
 * regression in it is invisible until a client challenges a number in a meeting.
 *
 * Run with:  npm run fixtures
 */
import type { Answers, BusinessContext, RespondentType } from '../types';
import { DECLINED } from '../types';
import { buildSnapshot } from './scoring';

const noContext: BusinessContext = { description: '', customers: '', proud: '' };

interface Fixture {
  name: string;
  type: RespondentType;
  answers: Answers;
  expect: (s: ReturnType<typeof buildSnapshot>) => [string, boolean][];
}

const FIXTURES: Fixture[] = [
  {
    name: 'A — strong performer, small leak',
    type: 'owner',
    answers: {
      industry: 'services',
      headcount: '10_29',
      revenue_band: '2m_10m',
      offer_clarity: 5,
      differentiation: ['expertise', 'quality'],
      offer_written: 'yes_strong',
      lead_sources: ['referral', 'search', 'repeat'],
      leads_per_month: '31_100',
      avg_deal_value: '2k_10k',
      response_time: 'under_15m',
      repetitive_hours: 'under_5',
      bottleneck: ['sales'],
      quote_days: 'same_day',
      owner_only_hours: 'under_5',
      digital_presence: ['website', 'gbp', 'linkedin', 'whatsapp_biz'],
      findability: 5,
      ai_usage: 'some_process',
      ai_blocker: ['nothing'],
      dormant_assets: ['customer_data', 'expertise'],
      decision_authority: 'yes_alone',
      timeline: 'this_quarter',
    },
    expect: (s) => [
      ['index is a high band', s.mvp3_index >= 65],
      ['a total was estimated', s.total_monthly_leak !== null],
      ['no dimension is null', s.dimension_scores.every((d) => d.score !== null)],
      ['cost of delay is 3x the monthly total', s.cost_of_delay_90 === (s.total_monthly_leak as number) * 3],
    ],
  },
  {
    name: 'B — heavy leaker, everything slow',
    type: 'owner',
    answers: {
      industry: 'construction',
      headcount: '30_79',
      revenue_band: '2m_10m',
      offer_clarity: 2,
      differentiation: ['price'],
      offer_written: 'no',
      lead_sources: ['referral'],
      leads_per_month: '101_300',
      avg_deal_value: '10k_50k',
      response_time: 'varies',
      repetitive_hours: 'over_100',
      bottleneck: ['owner', 'quoting'],
      quote_days: 'longer',
      owner_only_hours: 'over_30',
      digital_presence: [],
      findability: 1,
      ai_usage: 'none',
      ai_blocker: ['dont_know_where', 'skills'],
      dormant_assets: ['expertise', 'customer_data', 'brand'],
      decision_authority: 'yes_alone',
      timeline: 'this_month',
    },
    expect: (s) => {
      const revenueMonthly = 6_000_000 / 12;
      const l3 = s.leaks.find((l) => l.code === 'L3');
      const hard = s.leaks
        .filter((l) => ['L1', 'L2', 'L4', 'L5'].includes(l.code))
        .reduce((a, l) => a + (l.amount ?? 0), 0);
      return [
        ['index is a low band', s.mvp3_index < 50],
        ['total is capped at 35% of monthly revenue', s.total_monthly_leak === revenueMonthly * 0.35],
        ['cap flag is set', s.leak_capped === true],
        ['uncapped hard sum exceeded the cap', hard > revenueMonthly * 0.35],
        ['L3 has a value but is opportunity, not loss', l3?.amount !== null && l3?.kind === 'opportunity'],
        ['L3 is excluded from the total', (s.total_monthly_leak as number) < hard + (l3?.amount ?? 0)],
        ['candidate is the packaged-knowledge branch', s.mvp3_candidate.key === 'packaged_knowledge'],
      ];
    },
  },
  {
    name: 'C — declined every money question',
    type: 'owner',
    answers: {
      industry: 'retail',
      headcount: '2_9',
      revenue_band: DECLINED,
      offer_clarity: 3,
      differentiation: ['relationship'],
      offer_written: 'informal',
      lead_sources: ['walk_in', 'social'],
      leads_per_month: DECLINED,
      avg_deal_value: DECLINED,
      response_time: 'same_day',
      bottleneck: ['admin'],
      digital_presence: ['facebook', 'whatsapp_biz'],
      findability: 2,
      ai_usage: 'personal',
      ai_blocker: ['no_time'],
      dormant_assets: [],
      decision_authority: 'yes_alone',
      timeline: 'this_year',
    },
    expect: (s) => [
      ['no ringgit figure was invented', s.total_monthly_leak === null],
      ['no cost of delay was invented', s.cost_of_delay_90 === null],
      ['no hard leak carries an amount', s.leaks.filter((l) => l.kind === 'loss').every((l) => l.amount === null)],
      ['the index is still produced', s.mvp3_index > 0],
      ['the omission is recorded as a limitation', s.limitations.length > 0],
      ['skipped questions are null, not zero', s.dimension_scores.some((d) => d.score === null)],
    ],
  },
];

let failures = 0;

for (const f of FIXTURES) {
  const snap = buildSnapshot(f.answers, [], noContext, f.type, 'en');
  console.log(`\n${f.name}`);
  console.log(
    `  index ${snap.mvp3_index}  band ${snap.band_key}  ` +
      `total ${snap.total_monthly_leak === null ? 'none' : Math.round(snap.total_monthly_leak)}  ` +
      `candidate ${snap.mvp3_candidate.key}`,
  );
  for (const [label, ok] of f.expect(snap)) {
    if (!ok) failures++;
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}`);
  }
}

console.log(failures === 0 ? '\nAll fixtures pass.\n' : `\n${failures} assertion(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
