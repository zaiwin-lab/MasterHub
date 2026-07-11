export type Lang = 'en' | 'ms' | 'zh' | 'ib';

export const LANGS: { code: Lang; short: string; name: string }[] = [
  { code: 'en', short: 'EN', name: 'English' },
  { code: 'ms', short: 'BM', name: 'Bahasa Melayu' },
  { code: 'zh', short: '中', name: '中文' },
  { code: 'ib', short: 'IB', name: 'Iban' },
];

export interface CriterionText {
  label: string;
  hint: string;
  strength: string;
  clarify: string;
}

export interface Card {
  title: string;
  body: string;
}

export interface Dict {
  nav: {
    brandSub: string;
    assessment: string;
    framework: string;
    reportPreview: string;
    about: string;
    start: string;
  };
  hero: {
    badge: string;
    titleA: string;
    titleB: string;
    subtitle: string;
    ctaStart: string;
    ctaFramework: string;
    note: string;
  };
  wizard: {
    tag: string;
    heading: string;
    subtitle: string;
    back: string;
    proceed: string;
    generate: string;
    continue: string;
  };
  steps: [string, string, string, string, string];
  step1: {
    title: string;
    desc: string;
    ngoLabel: string;
    ngoPlaceholder: string;
    ngoError: string;
    providerLabel: string;
    providerPlaceholder: string;
    titleLabel: string;
    titlePlaceholder: string;
    optional: string;
  };
  step2: {
    title: string;
    desc: string;
    categoryLabel: string;
    categoryPlaceholder: string;
    targetLabel: string;
    targetPlaceholder: string;
    expectedLabel: string;
    expectedPlaceholder: string;
    locationLabel: string;
    locationPlaceholder: string;
    dateLabel: string;
    durationLabel: string;
    durationPlaceholder: string;
    budgetLabel: string;
    budgetPlaceholder: string;
    objectiveLabel: string;
    objectivePlaceholder: string;
  };
  step3: {
    title: string;
    desc: string;
    linksLabel: string;
    linksPlaceholder: string;
    uploadLabel: string;
    dropTitle: string;
    dropHint: string;
    notesLabel: string;
    notesPlaceholder: string;
  };
  step4: {
    title: string;
    desc: string;
    overall: string;
  };
  criteria: Record<string, CriterionText>;
  scoreLabels: Record<number, string>;
  bands: Record<string, string>;
  framework: {
    tag: string;
    title: string;
    subtitle: string;
    cards: Card[];
  };
  reportPreview: {
    tag: string;
    title: string;
    desc: string;
    bullets: string[];
    cta: string;
    sampleTag: string;
    sampleTitle: string;
    sampleOrg: string;
    sampleStatus: string;
    nextActionLabel: string;
    sampleNextAction: string;
  };
  about: {
    tag: string;
    title: string;
    p1: string;
    p2: string;
  };
  footer: {
    line1: string;
    line2: string;
  };
  result: {
    kicker: string;
    overallScore: string;
    ngo: string;
    provider: string;
    title: string;
    category: string;
    target: string;
    expected: string;
    locationDate: string;
    duration: string;
    requested: string;
    pax: string;
    criterionScores: string;
    keyStrengths: string;
    itemsClarification: string;
    committeeRemarks: string;
    suggestedNextAction: string;
    generatedBy: string;
    print: string;
    restart: string;
    noStrengths: string;
    noClarify: string;
    fallbackTitle: string;
    fallbackNgo: string;
    fallbackProgramme: string;
  };
  /** Remarks templates keyed by band; {title} and {ngo} are replaced. */
  remarks: Record<string, string>;
  nextActions: Record<string, string>;
  staff: {
    name: string;
    tagline: string;
    open: string;
    greeting: string;
    comingSoon: string;
    inputPlaceholder: string;
    quickReplies: { q: string; a: string }[];
  };
  whatsapp: {
    label: string;
  };
}
