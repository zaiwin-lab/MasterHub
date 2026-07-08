import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <section id="top" className="no-print border-b border-navy-100 bg-gradient-to-b from-navy-50/70 to-white">
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-14 text-center sm:pt-20">
        <span className="section-tag mx-auto">
          <ShieldCheck size={13} />
          Complimentary platform by KOBIS Berhad
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-navy-900 sm:text-5xl">
          Structured Programme Assessment for{' '}
          <span className="text-teal-600">BizFund2 Submissions</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink/60 sm:text-lg">
          Assist the Committee in reviewing NGO and training programme
          submissions with a consistent scoring framework, clear documentation
          flow, and executive-ready recommendation summary.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#assessment" className="btn-primary w-full sm:w-auto">
            Start Assessment
            <ArrowRight size={16} />
          </a>
          <a href="#framework" className="btn-secondary w-full sm:w-auto">
            View Evaluation Framework
          </a>
        </div>
        <p className="mt-5 text-xs font-medium text-ink/40">
          No sign-in required · Prepared for SBF Committee review
        </p>
      </div>
    </section>
  );
}
