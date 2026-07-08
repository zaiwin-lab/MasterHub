import { Building2 } from 'lucide-react';

export default function About() {
  return (
    <section
      id="about"
      className="no-print scroll-mt-20 border-t border-navy-100 bg-navy-50/40 py-14"
    >
      <div className="mx-auto max-w-3xl px-5 text-center">
        <span className="section-tag mx-auto">
          <Building2 size={13} />
          About
        </span>
        <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-navy-900 sm:text-3xl">
          A value-added tool for SBF
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-ink/65 sm:text-base">
          KOBIS Berhad is pleased to provide this complimentary system to SBF
          as an additional value-added support tool. The platform is adapted
          from KOBIS Berhad&rsquo;s internal proposal governance and quality
          assurance process, currently used by our team to review major
          proposals before submission to strategic partners.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ink/65 sm:text-base">
          This version can be customised into a dedicated BizFund2 Proposal
          Assessment &amp; Evaluation System tailored to SBF&rsquo;s governance
          requirements.
        </p>
      </div>
    </section>
  );
}
