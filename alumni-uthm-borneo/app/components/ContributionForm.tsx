'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  AMOUNTS,
  LIMITS,
  PURPOSES,
  formatRM,
  parseAmount,
  validateContribution,
  type ContributionInput,
  type ContributionType,
  type FieldErrors,
} from '@/lib/rules';
import { site } from '@/content/site';
import { Lock, Shield } from './icons';

const DEFAULT_PURPOSE: Record<ContributionType, string> = {
  individual: 'General Alumni Contribution',
  corporate: 'Corporate Contribution',
};

const REMARK_PLACEHOLDER =
  'Leave a message, dedication, payment reference or any additional information regarding your contribution.';

// Order used to move focus to the first problem after a failed submit.
const FIELD_ORDER: (keyof ContributionInput)[] = [
  'type',
  'amount',
  'organisationName',
  'name',
  'email',
  'mobile',
  'purpose',
  'remark',
  'acknowledged',
];

export function ContributionForm({ paymentMethods = 'Online banking (FPX)' }: { paymentMethods?: string }) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  const [type, setType] = useState<ContributionType>('individual');
  const [preset, setPreset] = useState<number | 'other'>(AMOUNTS.individual.presets[1]);
  const [otherAmount, setOtherAmount] = useState('');
  const [name, setName] = useState('');
  const [organisationName, setOrganisationName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [purpose, setPurpose] = useState(DEFAULT_PURPOSE.individual);
  const [purposeTouched, setPurposeTouched] = useState(false);
  const [remark, setRemark] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const otherRef = useRef<HTMLInputElement>(null);

  const amount = preset === 'other' ? parseAmount(otherAmount) : preset;

  const input: ContributionInput = {
    type,
    name,
    organisationName,
    email,
    mobile,
    purpose,
    amount,
    remark,
    acknowledged,
  };

  function chooseType(next: ContributionType) {
    if (next === type) return;
    setType(next);
    setPreset(AMOUNTS[next].presets[next === 'corporate' ? 0 : 1]);
    setOtherAmount('');
    if (!purposeTouched) setPurpose(DEFAULT_PURPOSE[next]);
  }

  // Hero "Corporate Contribution" button links to #corporate.
  const chooseTypeRef = useRef(chooseType);
  chooseTypeRef.current = chooseType;
  useEffect(() => {
    const sync = () => {
      if (window.location.hash === '#corporate') chooseTypeRef.current('corporate');
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  // After the first submit attempt, keep errors live as the user fixes them.
  useEffect(() => {
    if (submitted) setErrors(validateContribution(input));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted, type, preset, otherAmount, name, organisationName, email, mobile, purpose, remark, acknowledged]);

  function focusFirstError(errs: FieldErrors) {
    const first = FIELD_ORDER.find((k) => errs[k]);
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`);
    el?.focus();
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setFormError('');
    const errs = validateContribution(input);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      focusFirstError(errs);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...input, website }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        paymentUrl?: string;
        error?: string;
        fields?: FieldErrors;
      };
      if (res.ok && data.paymentUrl) {
        window.location.assign(data.paymentUrl);
        return; // keep the button in its loading state while the browser navigates
      }
      if (data.fields) {
        setErrors(data.fields);
        focusFirstError(data.fields);
      }
      setFormError(data.error || 'Something went wrong. Please try again.');
    } catch {
      setFormError('We could not reach the server. Check your connection and try again.');
    }
    setSubmitting(false);
  }

  const err = (k: keyof ContributionInput) =>
    errors[k] ? (
      <p className="field-error" id={id(`${k}-error`)}>
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof ContributionInput, hint?: string) => ({
    'aria-invalid': errors[k] ? (true as const) : undefined,
    'aria-describedby': [errors[k] ? id(`${k}-error`) : '', hint ?? ''].filter(Boolean).join(' ') || undefined,
    'data-field': k,
  });

  const rule = AMOUNTS[type];
  const amountValid = Number.isFinite(amount) && amount > 0;

  return (
    // id="corporate" is the target of the hero "Corporate Contribution" link.
    <form ref={formRef} id="corporate" className="form-panel" onSubmit={onSubmit} noValidate aria-label="Contribution form">
      {formError && (
        <div className="form-alert" role="alert">
          {formError}
        </div>
      )}

      <fieldset className="form-step">
        <legend>Contribution type</legend>
        <div className="type-options">
          {(
            [
              ['individual', 'Alumni / Individual', `From ${formatRM(AMOUNTS.individual.presets[0])}`],
              ['corporate', 'Corporate / Organisation', `From ${formatRM(AMOUNTS.corporate.min)}`],
            ] as const
          ).map(([value, title, sub]) => (
            <label key={value} className="tile">
              <input
                type="radio"
                name="type"
                value={value}
                checked={type === value}
                onChange={() => chooseType(value)}
                {...(value === 'individual' ? { 'data-field': 'type' } : {})}
              />
              <span className="tile-title">{title}</span>
              <span className="tile-sub">{sub}</span>
            </label>
          ))}
        </div>
        {type === 'corporate' && (
          <p className="hint type-hint">
            Eligible approved corporate contributions may receive recognition.{' '}
            <a href="#recognition">See recognition details</a>
          </p>
        )}
      </fieldset>

      <fieldset className="form-step">
        <legend>Amount</legend>
        <div className="amounts">
          {rule.presets.map((value, i) => (
            <label key={value} className="chip">
              <input
                type="radio"
                name="amount"
                value={value}
                checked={preset === value}
                onChange={() => setPreset(value)}
                {...(i === 0 && preset !== 'other' ? { 'data-field': 'amount' } : {})}
              />
              {formatRM(value)}
            </label>
          ))}
          <label className="chip chip-other">
            <input
              type="radio"
              name="amount"
              value="other"
              checked={preset === 'other'}
              onChange={() => {
                setPreset('other');
                requestAnimationFrame(() => otherRef.current?.focus());
              }}
            />
            Other amount
          </label>
        </div>
        {preset === 'other' && (
          <div className="field">
            <label htmlFor={id('other')} className="sr-only">
              Enter amount in Ringgit
            </label>
            <div className="amount-input">
              <span aria-hidden="true">RM</span>
              <input
                ref={otherRef}
                id={id('other')}
                className="input"
                inputMode="decimal"
                autoComplete="off"
                placeholder={type === 'corporate' ? '1,000 or more' : 'Enter amount'}
                value={otherAmount}
                onChange={(e) => setOtherAmount(e.target.value.replace(/[^0-9.,]/g, ''))}
                aria-invalid={errors.amount ? true : undefined}
                aria-describedby={errors.amount ? id('amount-error') : id('amount-hint')}
                data-field="amount"
              />
            </div>
            {!errors.amount && (
              <p className="hint" id={id('amount-hint')}>
                Minimum {formatRM(rule.min)}.
              </p>
            )}
          </div>
        )}
        {err('amount')}
      </fieldset>

      <fieldset className="form-step">
        <legend>Your details</legend>
        {type === 'corporate' && (
          <div className="field">
            <label htmlFor={id('org')}>Organisation name</label>
            <input
              id={id('org')}
              className="input"
              autoComplete="organization"
              maxLength={LIMITS.name}
              value={organisationName}
              onChange={(e) => setOrganisationName(e.target.value)}
              {...aria('organisationName')}
            />
            {err('organisationName')}
          </div>
        )}
        <div className="field">
          <label htmlFor={id('name')}>{type === 'corporate' ? 'Contact person' : 'Full name'}</label>
          <input
            id={id('name')}
            className="input"
            autoComplete="name"
            maxLength={LIMITS.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            {...aria('name')}
          />
          {err('name')}
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor={id('email')}>Email</label>
            <input
              id={id('email')}
              className="input"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              maxLength={LIMITS.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              {...aria('email', id('email-hint'))}
            />
            {errors.email ? (
              err('email')
            ) : (
              <p className="hint" id={id('email-hint')}>
                Your receipt is sent here.
              </p>
            )}
          </div>
          <div className="field">
            <label htmlFor={id('mobile')}>Mobile number</label>
            <input
              id={id('mobile')}
              className="input"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="012-345 6789"
              maxLength={LIMITS.mobile}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              {...aria('mobile')}
            />
            {err('mobile')}
          </div>
        </div>
      </fieldset>

      <fieldset className="form-step">
        <legend>Purpose</legend>
        <div className="field">
          <label htmlFor={id('purpose')} className="sr-only">
            Contribution or payment purpose
          </label>
          <select
            id={id('purpose')}
            className="input"
            value={purpose}
            onChange={(e) => {
              setPurpose(e.target.value);
              setPurposeTouched(true);
            }}
            {...aria('purpose')}
          >
            {PURPOSES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {err('purpose')}
        </div>
        <div className="field">
          <label htmlFor={id('remark')}>
            Remark / message <span className="req">(optional)</span>
          </label>
          <textarea
            id={id('remark')}
            className="input"
            rows={4}
            maxLength={LIMITS.remark}
            placeholder={REMARK_PLACEHOLDER}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            {...aria('remark', id('remark-hint'))}
          />
          <p className="hint" id={id('remark-hint')}>
            For example: &ldquo;Contribution for Anak Sarawak Award&rdquo;, &ldquo;On behalf of ABC Sdn Bhd&rdquo; or
            &ldquo;Alumni programme, 3 pax&rdquo;. This appears on your receipt.
          </p>
          <span className="counter" aria-hidden="true">
            {remark.length}/{LIMITS.remark}
          </span>
          {err('remark')}
        </div>
      </fieldset>

      <div className="summary" aria-live="polite">
        <span className="summary-purpose">{purpose}</span>
        <span className="summary-amount">{amountValid ? formatRM(amount) : 'RM –'}</span>
      </div>

      <section className="arrangement" aria-labelledby={id('arr')}>
        <h3 id={id('arr')}>
          <Shield />
          Payment &amp; Administrative Arrangement
        </h3>
        <div className="arrangement-body">
          <p>
            {site.formalName} is currently operating through an interim administrative arrangement. For the purpose of
            receiving and administering contributions and programme-related payments, transactions are temporarily
            facilitated through {site.facilitator}.
          </p>
          <p>
            {site.facilitator} provides the administrative and payment infrastructure while contributions are recorded
            according to their stated purpose for {site.formalName} activities and initiatives.
          </p>
          <p>
            This arrangement provides a structured, traceable and accountable payment channel while the Chapter&rsquo;s
            longer-term administrative structure is being formalised.
          </p>
        </div>
        <label className="check">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            {...aria('acknowledged')}
          />
          <span>I acknowledge the payment and administrative arrangement described above.</span>
        </label>
        {err('acknowledged')}
      </section>

      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      <div className="pay">
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Opening secure payment…
            </>
          ) : (
            <span className="pay-label">
              Proceed to Secure Payment
              <span className="pay-methods">{paymentMethods}</span>
            </span>
          )}
        </button>
        <p className="powered">
          <Lock />
          Powered by ToyyibPay
        </p>
      </div>
    </form>
  );
}
