'use client';

import { useState } from 'react';
import { CheckCircle2, Search, ShieldAlert, ShieldCheck, UserRound } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { can } from '@/core/access/permissions';
import { verifyEligibility, type EligibilityView } from '@/core/data/repository';
import { eligibilityDecision } from '@/core/workflow/engine';
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, Field, Input, Select, Textarea } from '@/components/ui/primitives';
import { PageHeader } from '@/components/shell/page-header';
import { formatMoney } from '@/lib/utils';

type Step = 'verify' | 'record' | 'done';

export default function ClinicPortalPage() {
  const { db, config, session, actions } = useStore();
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState<EligibilityView | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [step, setStep] = useState<Step>('verify');
  const [form, setForm] = useState({ category: config.serviceCategories[0], amount: '', mcDays: '0', notes: '', supportingRecord: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [receipt, setReceipt] = useState<{ reference: string; amount: number; status: string } | null>(null);

  if (!session || !can(session, 'clinic.verifyEligibility')) {
    return <EmptyState title="Clinic access only" description="This portal is available to authorised panel clinic personnel." />;
  }

  const t = config.terminology;
  const clinic = db.clinics.find((c) => c.id === session.clinicId);
  const policy = db.policies[0];
  const amount = Number(form.amount || 0);
  const decision = subject
    ? eligibilityDecision({ eligible: subject.eligible, employeeStatus: subject.status, spendable: subject.spendable, amount, policy })
    : null;

  const runVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const found = verifyEligibility(db, session, query);
    setSubject(found);
    setNotFound(!found);
    setStep(found ? 'record' : 'verify');
    setReceipt(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!amount || amount <= 0) next.amount = 'Enter the amount charged for this visit.';
    if (amount > 5000) next.amount = 'Amounts above 5,000 must be submitted through the manual policy route.';
    if (!form.category) next.category = 'Select the service category.';
    setErrors(next);
    if (Object.keys(next).length || !subject || !decision?.allowed || !session.clinicId) return;

    const txn = actions.submitTransaction({
      employeeId: subject.employeeId,
      clinicId: session.clinicId,
      date: new Date().toISOString().slice(0, 10),
      serviceCategory: form.category,
      amount,
      mcDays: Number(form.mcDays || 0),
      notes: form.notes || undefined,
      supportingRecord: form.supportingRecord || undefined,
      excess: decision.requiresPolicyRoute,
    });
    setReceipt({ reference: txn.reference, amount: txn.amount, status: txn.status });
    setStep('done');
  };

  const reset = () => {
    setQuery(''); setSubject(null); setNotFound(false); setStep('verify');
    setForm({ category: config.serviceCategories[0], amount: '', mcDays: '0', notes: '', supportingRecord: '' });
    setErrors({}); setReceipt(null);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Panel clinic portal"
        description={`${clinic?.name ?? 'Panel clinic'} — verify the person in front of you, then record the visit. You see eligibility and remaining balance only.`}
        zone="zone1"
        zoneNote="Minimum necessary disclosure"
      />

      <ol className="mb-5 flex flex-wrap items-center gap-2 text-[12.5px]">
        {(['verify', 'record', 'done'] as Step[]).map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold ${step === s ? 'bg-navy text-white' : i < ['verify', 'record', 'done'].indexOf(step) ? 'bg-brand/15 text-brand' : 'bg-navy/[0.07] text-ink-soft'}`}>
              {i + 1}
            </span>
            <span className={step === s ? 'font-medium text-navy' : 'text-ink-muted'}>
              {s === 'verify' ? 'Verify eligibility' : s === 'record' ? 'Record visit' : 'Submitted'}
            </span>
            {i < 2 ? <span className="mx-1 text-ink-soft">→</span> : null}
          </li>
        ))}
      </ol>

      <Card>
        <CardHeader title="Step 1 — Verify" subtitle="Enter the staff number or full name shown on the employee's identification." />
        <CardBody className="pt-2">
          <form onSubmit={runVerify} className="flex flex-wrap items-end gap-3">
            <Field label="Staff number or name" className="min-w-[220px] flex-1">
              <Input value={query} onChange={(e) => { setQuery(e.target.value); setNotFound(false); }} placeholder={`e.g. ${db.employees[0]?.staffNo ?? 'STIDC1000'}`} />
            </Field>
            <Button type="submit" variant="primary" className="mb-0.5"><Search size={15} /> Verify</Button>
            {subject ? <Button type="button" variant="quiet" className="mb-0.5" onClick={reset}>Start over</Button> : null}
          </form>

          {notFound ? (
            <p className="mt-3 rounded-xl border border-warn/30 bg-warn/[0.07] px-4 py-3 text-[13px] text-ink">
              No match for “{query}”. Check the staff number, or ask the employee to confirm the spelling of their
              name. Try <span className="font-medium">{db.employees[0]?.staffNo}</span> in this demonstration.
            </p>
          ) : null}

          {subject ? (
            <div className="mt-4 rounded-2xl border border-line bg-canvas/60 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-navy/[0.06] text-navy"><UserRound size={19} /></span>
                  <div>
                    <p className="font-display text-[17px] leading-tight text-navy">{subject.name}</p>
                    <p className="text-[12.5px] text-ink-muted">{subject.staffNo} · {subject.policyName}</p>
                  </div>
                </div>
                <Badge tone={subject.eligible ? 'ok' : 'risk'}>
                  {subject.eligible ? <><ShieldCheck size={13} /> Eligible</> : <><ShieldAlert size={13} /> Not eligible</>}
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Figure label="Entitlement" value={formatMoney(subject.entitlement, t.currency)} />
                <Figure label="Available today" value={formatMoney(subject.spendable, t.currency)} tone={subject.spendable <= 0 ? 'risk' : undefined} />
                <Figure label="Utilised" value={`${subject.utilisationPct}%`} />
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-ink-soft">
                This is the complete set of information the clinic receives. Past visits, wellbeing data, grade and
                salary are not disclosed.
              </p>
            </div>
          ) : null}
        </CardBody>
      </Card>

      {subject && step !== 'done' ? (
        <Card className="mt-4">
          <CardHeader title="Step 2 — Record the visit" subtitle="Submitting sends the entry into the approval workflow and updates the wallet once approved." />
          <CardBody className="pt-2">
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Service category" required error={errors.category}>
                  <Select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                    {config.serviceCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </Field>
                <Field label={`Amount (${t.currency})`} required error={errors.amount} hint={`Visits at or below ${formatMoney(policy.approval.autoApproveUnder, t.currency)} are verified automatically.`}>
                  <Input type="number" min="0" step="0.01" inputMode="decimal" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} placeholder="0.00" />
                </Field>
                <Field label="Medical certificate days" hint="Leave at zero if none was issued.">
                  <Input type="number" min="0" max="30" value={form.mcDays} onChange={(e) => setForm((f) => ({ ...f, mcDays: e.target.value }))} />
                </Field>
                <Field label="Supporting record reference" hint="Optional. The document itself stays in clinic systems.">
                  <Input value={form.supportingRecord} onChange={(e) => setForm((f) => ({ ...f, supportingRecord: e.target.value }))} placeholder="e.g. RCPT-20481" />
                </Field>
              </div>
              <Field label="Notes" hint="Administrative notes only — no clinical detail should be entered here.">
                <Textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="e.g. Follow-up visit" />
              </Field>

              {decision && amount > 0 ? (
                <div className={`rounded-xl border px-4 py-3 text-[13px] leading-relaxed ${decision.allowed && !decision.requiresPolicyRoute ? 'border-ok/25 bg-ok/[0.06] text-ink' : decision.allowed ? 'border-warn/30 bg-warn/[0.07] text-ink' : 'border-risk/30 bg-risk/[0.06] text-ink'}`}>
                  <span className="font-medium text-navy">{decision.allowed ? (decision.requiresPolicyRoute ? 'Proceeds under the policy exception route' : 'Within available balance') : 'Cannot be submitted'}</span>
                  {' — '}{decision.reason}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Button type="submit" variant="primary" disabled={!decision?.allowed}>Submit transaction</Button>
                <Button type="button" variant="quiet" onClick={reset}>Cancel</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      ) : null}

      {receipt ? (
        <Card className="mt-4 border-ok/30">
          <CardBody>
            <div className="flex items-start gap-3">
              <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-ok" />
              <div>
                <p className="font-display text-[18px] leading-tight text-navy">Transaction submitted</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink-muted">
                  Reference <span className="font-medium text-ink">{receipt.reference}</span> for {formatMoney(receipt.amount, t.currency)} —
                  currently <span className="font-medium text-ink">{receipt.status}</span>. The employee has been notified and
                  their wallet updates once the entry is approved.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={reset}>Record another visit</Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}

function Figure({ label, value, tone }: { label: string; value: string; tone?: 'risk' }) {
  return (
    <div>
      <p className="label">{label}</p>
      <p className={`mt-1 font-display text-[18px] leading-none ${tone === 'risk' ? 'text-risk' : 'text-navy'}`}>{value}</p>
    </div>
  );
}
