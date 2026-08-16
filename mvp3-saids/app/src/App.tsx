import { useCallback, useEffect } from 'react';
import { useScan } from './state/store';
import { buildSnapshot } from './lib/scoring';
import { Chrome, Footer } from './components/ui';
import Intro from './screens/Intro';
import { Consent, RespondentPick } from './screens/Consent';
import Survey from './screens/Survey';
import MagicBox from './screens/MagicBox';
import { Processing, Review } from './screens/Review';
import SnapshotView from './screens/SnapshotView';

export default function App() {
  const { state, patch, setAnswer, saved, resume, reset } = useScan();

  useEffect(() => {
    document.documentElement.lang = state.lang === 'bm' ? 'ms' : 'en';
  }, [state.lang]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state.screen, state.index]);

  const generate = useCallback(() => {
    if (!state.respondentType) return;
    const snapshot = buildSnapshot(
      state.answers,
      state.assets,
      state.context,
      state.respondentType,
      state.lang,
    );
    patch({ snapshot, screen: 'snapshot' });
  }, [state.answers, state.assets, state.context, state.respondentType, state.lang, patch]);

  // A language change after generation re-renders the report in the new language
  // without recomputing it — the engine is independent of the active language.
  const setLang = (lang: typeof state.lang) => patch({ lang });

  if (state.screen === 'snapshot' && state.snapshot) {
    return (
      <>
        <Chrome lang={state.lang} setLang={setLang} />
        <SnapshotView
          snap={state.snapshot}
          lang={state.lang}
          answers={state.answers}
          consents={state.consents}
        />
      </>
    );
  }

  return (
    <>
      <Chrome lang={state.lang} setLang={setLang} />

      {state.screen === 'intro' && (
        <Intro
          lang={state.lang}
          onStart={() => patch({ screen: 'consent', startedAt: new Date().toISOString() })}
          resumeCount={saved ? Object.keys(saved.answers).length : null}
          onResume={resume}
          onReset={reset}
        />
      )}

      {state.screen === 'consent' && (
        <Consent
          lang={state.lang}
          consents={state.consents}
          setConsents={(consents) => patch({ consents })}
          onContinue={() => patch({ screen: 'respondent' })}
          onBack={() => patch({ screen: 'intro' })}
        />
      )}

      {state.screen === 'respondent' && (
        <RespondentPick
          lang={state.lang}
          onPick={(respondentType) => patch({ respondentType, screen: 'survey', index: 0 })}
          onBack={() => patch({ screen: 'consent' })}
        />
      )}

      {state.screen === 'survey' && state.respondentType && (
        <Survey
          lang={state.lang}
          respondentType={state.respondentType}
          index={state.index}
          answers={state.answers}
          setAnswer={setAnswer}
          setIndex={(index) => patch({ index })}
          onDone={() => patch({ screen: 'magicbox' })}
          onBack={() => patch({ screen: 'respondent' })}
        />
      )}

      {state.screen === 'magicbox' && (
        <MagicBox
          lang={state.lang}
          assets={state.assets}
          setAssets={(assets) => patch({ assets })}
          context={state.context}
          setContext={(context) => patch({ context })}
          onDone={() => patch({ screen: 'review' })}
          onBack={() => patch({ screen: 'survey' })}
        />
      )}

      {state.screen === 'review' && state.respondentType && (
        <Review
          lang={state.lang}
          respondentType={state.respondentType}
          answers={state.answers}
          onGenerate={() => patch({ screen: 'processing' })}
          onBack={() => patch({ screen: 'magicbox' })}
        />
      )}

      {state.screen === 'processing' && <Processing lang={state.lang} onDone={generate} />}

      {state.screen !== 'survey' && <Footer lang={state.lang} />}
    </>
  );
}
