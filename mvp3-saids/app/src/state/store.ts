import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  Answers,
  AnswerValue,
  BusinessContext,
  Consents,
  DetectedAsset,
  Lang,
  RespondentType,
  Snapshot,
} from '../types';
import { CONSENT_VERSION } from '../data/survey';

export type Screen =
  | 'intro'
  | 'consent'
  | 'respondent'
  | 'survey'
  | 'magicbox'
  | 'review'
  | 'processing'
  | 'snapshot';

export interface State {
  screen: Screen;
  lang: Lang;
  respondentType: RespondentType | null;
  index: number;
  answers: Answers;
  assets: DetectedAsset[];
  context: BusinessContext;
  consents: Consents;
  snapshot: Snapshot | null;
  startedAt: string | null;
}

const KEY = 'yourbestmvp.scan.v1';

const emptyContext: BusinessContext = { description: '', customers: '', proud: '' };

function detectLang(): Lang {
  if (typeof navigator === 'undefined') return 'en';
  return /^ms|^id/i.test(navigator.language) ? 'bm' : 'en';
}

export const initialState = (): State => ({
  screen: 'intro',
  lang: detectLang(),
  respondentType: null,
  index: 0,
  answers: {},
  assets: [],
  context: emptyContext,
  consents: {
    research: false,
    reportEmail: false,
    futureComms: false,
    version: CONSENT_VERSION,
    timestampIso: null,
  },
  snapshot: null,
  startedAt: null,
});

function load(): State | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<State>;
    if (!parsed || typeof parsed !== 'object') return null;
    return { ...initialState(), ...parsed };
  } catch {
    return null;
  }
}

function save(s: State) {
  try {
    // The snapshot is regenerated deterministically, so it is not persisted.
    const { snapshot: _snapshot, ...rest } = s;
    localStorage.setItem(KEY, JSON.stringify(rest));
  } catch {
    /* storage full or blocked — the session still works, it just won't resume */
  }
}

export function useScan() {
  const [state, setState] = useState<State>(() => initialState());
  const [saved, setSaved] = useState<State | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    const s = load();
    if (s && Object.keys(s.answers).length > 0 && s.respondentType) {
      setSaved(s);
      setState((cur) => ({ ...cur, lang: s.lang }));
    } else if (s) {
      setState((cur) => ({ ...cur, lang: s.lang }));
    }
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    save(state);
  }, [state]);

  const patch = useCallback((p: Partial<State>) => setState((cur) => ({ ...cur, ...p })), []);

  const setAnswer = useCallback(
    (id: string, value: AnswerValue) => setState((cur) => ({ ...cur, answers: { ...cur.answers, [id]: value } })),
    [],
  );

  const resume = useCallback(() => {
    if (!saved) return;
    setState({ ...saved, screen: saved.screen === 'processing' ? 'review' : saved.screen, snapshot: null });
    setSaved(null);
  }, [saved]);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    const fresh = initialState();
    setState({ ...fresh, lang: state.lang });
    setSaved(null);
  }, [state.lang]);

  return { state, patch, setAnswer, saved, resume, reset };
}
