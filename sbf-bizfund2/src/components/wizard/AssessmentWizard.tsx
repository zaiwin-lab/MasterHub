import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CRITERIA } from '../../lib/constants';
import {
  initialMaterials,
  initialOrg,
  initialProgramme,
  type Materials,
  type OrgDetails,
  type ProgrammeInfo,
  type Scores,
} from '../../lib/types';
import StepIndicator from './StepIndicator';
import Step1Org from './Step1Org';
import Step2Programme from './Step2Programme';
import Step3Materials from './Step3Materials';
import Step4Scoring from './Step4Scoring';
import ResultSummary from './ResultSummary';

const initialScores = (): Scores =>
  Object.fromEntries(CRITERIA.map((c) => [c.key, 3]));

export default function AssessmentWizard() {
  const [step, setStep] = useState(1);
  const [org, setOrg] = useState<OrgDetails>(initialOrg);
  const [programme, setProgramme] = useState<ProgrammeInfo>(initialProgramme);
  const [materials, setMaterials] = useState<Materials>(initialMaterials);
  const [scores, setScores] = useState<Scores>(initialScores);
  const [showErrors, setShowErrors] = useState(false);

  // Only the association is mandatory; everything else can be completed later
  // (e.g. auto-filled by AI from the uploaded links & files).
  const step1Valid = org.ngo.trim() !== '';

  const scrollToWizard = () =>
    document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' });

  const next = () => {
    if (step === 1 && !step1Valid) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setStep((s) => Math.min(5, s + 1));
    scrollToWizard();
  };

  const back = () => {
    setStep((s) => Math.max(1, s - 1));
    scrollToWizard();
  };

  const restart = () => {
    setOrg(initialOrg);
    setProgramme(initialProgramme);
    setMaterials(initialMaterials);
    setScores(initialScores());
    setShowErrors(false);
    setStep(1);
    scrollToWizard();
  };

  const nextLabel =
    step === 1
      ? 'Proceed to Proposal Assessment'
      : step === 4
        ? 'Generate Result Summary'
        : 'Continue';

  return (
    <section id="assessment" className="scroll-mt-20 bg-white py-14">
      <div className="mx-auto max-w-3xl px-5">
        <div className="no-print mb-8 text-center">
          <span className="section-tag">Assessment</span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
            Programme Assessment Flow
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-ink/55">
            Five short steps from organisation details to an executive-ready
            recommendation summary.
          </p>
        </div>

        <StepIndicator current={step} />

        <div className="card mt-8 p-6 sm:p-8">
          {step === 1 && (
            <Step1Org
              value={org}
              onChange={(p) => setOrg((v) => ({ ...v, ...p }))}
              showErrors={showErrors}
            />
          )}
          {step === 2 && (
            <Step2Programme
              value={programme}
              onChange={(p) => setProgramme((v) => ({ ...v, ...p }))}
            />
          )}
          {step === 3 && (
            <Step3Materials
              value={materials}
              onChange={(p) => setMaterials((v) => ({ ...v, ...p }))}
            />
          )}
          {step === 4 && (
            <Step4Scoring
              scores={scores}
              onChange={(key, score) => setScores((s) => ({ ...s, [key]: score }))}
            />
          )}
          {step === 5 && (
            <ResultSummary
              org={org}
              programme={programme}
              scores={scores}
              onRestart={restart}
            />
          )}
        </div>

        {step < 5 && (
          <div className="no-print mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={back}
              disabled={step === 1}
              className="btn-secondary disabled:invisible"
            >
              <ArrowLeft size={15} />
              Back
            </button>
            <button type="button" onClick={next} className="btn-primary">
              {nextLabel}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
