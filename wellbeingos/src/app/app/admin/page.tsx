'use client';

import { useState } from 'react';
import { Building2, Boxes, KeyRound, Palette, ShieldCheck, SlidersHorizontal, Type, Users2 } from 'lucide-react';
import { useStore } from '@/core/data/store';
import { can, roleLabels, roleMatrix } from '@/core/access/permissions';
import type { ModuleKey } from '@/core/config/tenant';
import type { AlertThreshold, RoleKey } from '@/core/domain/types';
import { tenantList } from '@/tenants/registry';
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, Field, Input, Select, Table, Td, Textarea, Th, Toggle } from '@/components/ui/primitives';
import { PageHeader } from '@/components/shell/page-header';
import { cn, formatMoney } from '@/lib/utils';

type Tab = 'organisation' | 'branding' | 'policy' | 'modules' | 'roles' | 'privacy' | 'tenants';

const tabs: { key: Tab; label: string; icon: typeof Building2 }[] = [
  { key: 'organisation', label: 'Organisation', icon: Building2 },
  { key: 'branding', label: 'Branding & terminology', icon: Palette },
  { key: 'policy', label: 'Benefit policy', icon: Boxes },
  { key: 'modules', label: 'Modules', icon: SlidersHorizontal },
  { key: 'roles', label: 'Roles & permissions', icon: KeyRound },
  { key: 'privacy', label: 'Privacy', icon: ShieldCheck },
  { key: 'tenants', label: 'Tenants', icon: Users2 },
];

export default function AdminPage() {
  const { config, db, session, updateConfig, switchTenant, tenantId, resetDemoData } = useStore();
  const [tab, setTab] = useState<Tab>('organisation');

  if (!session || !can(session, 'tenant.configure')) {
    return <EmptyState title="Configuration restricted" description="Tenant configuration is available to platform administrators." />;
  }

  const policy = config.policies[0];
  const t = config.terminology;

  const setPolicy = (patch: Partial<typeof policy>) => updateConfig({ policies: [{ ...policy, ...patch }] });
  const setThresholds = (thresholds: AlertThreshold[]) => setPolicy({ thresholds });

  return (
    <div>
      <PageHeader
        title="Configuration centre"
        description="Everything on this page is tenant configuration. Changing it changes the product for this organisation — without touching source code, and without affecting any other tenant."
        zone="zone1"
      />

      <div className="mb-5 flex flex-wrap gap-1.5 rounded-2xl border border-line bg-surface p-1.5">
        {tabs.map((tb) => {
          const Icon = tb.icon;
          return (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] transition-colors',
                tab === tb.key ? 'bg-navy text-white' : 'text-ink-muted hover:bg-navy/[0.05] hover:text-ink',
              )}
            >
              <Icon size={15} /> {tb.label}
            </button>
          );
        })}
      </div>

      {tab === 'organisation' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Organisation identity" subtitle="Used across sign-in, navigation, reports and exports." />
            <CardBody className="space-y-4 pt-2">
              <Field label="Organisation name"><Input defaultValue={config.organisationName} onBlur={(e) => updateConfig({ organisationName: e.target.value })} /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Organisation code"><Input defaultValue={config.organisationCode} onBlur={(e) => updateConfig({ organisationCode: e.target.value })} /></Field>
                <Field label="Short name"><Input defaultValue={config.shortName} onBlur={(e) => updateConfig({ shortName: e.target.value })} /></Field>
              </div>
              <Field label="Welcome text" hint="Shown on the sign-in screen.">
                <Textarea defaultValue={config.welcomeText} onBlur={(e) => updateConfig({ welcomeText: e.target.value })} />
              </Field>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Structure" subtitle={`${t.unitPlural}, locations and employee categories seed the organisation model.`} />
            <CardBody className="space-y-4 pt-2">
              <div>
                <p className="label mb-2">{t.unitPlural}</p>
                <div className="flex flex-wrap gap-1.5">
                  {config.organisation.divisions.map((d) => (
                    <Badge key={d.name} tone="muted">{d.name} ({d.departments.length})</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="label mb-2">Locations</p>
                <div className="flex flex-wrap gap-1.5">{config.organisation.locations.map((l) => <Badge key={l} tone="muted">{l}</Badge>)}</div>
              </div>
              <div>
                <p className="label mb-2">Employee categories</p>
                <div className="flex flex-wrap gap-1.5">{config.organisation.employeeCategories.map((c) => <Badge key={c} tone="muted">{c}</Badge>)}</div>
              </div>
              <p className="rounded-xl bg-canvas px-4 py-3 text-[12.5px] leading-relaxed text-ink-muted">
                Structure is defined in the tenant configuration file and, in production, synchronised from the HRIS
                adapter. Editing it here would diverge from the source of record, so it is presented read-only.
              </p>
            </CardBody>
          </Card>
        </div>
      ) : null}

      {tab === 'branding' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="White-label" subtitle="Colours apply immediately — the design tokens are runtime values, not compiled ones." />
            <CardBody className="space-y-4 pt-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Product name"><Input defaultValue={config.productName} onBlur={(e) => updateConfig({ productName: e.target.value })} /></Field>
                <Field label="Logo mark" hint="Two to four characters."><Input maxLength={4} defaultValue={config.logoMark} onBlur={(e) => updateConfig({ logoMark: e.target.value })} /></Field>
              </div>
              <Field label="Tagline"><Input defaultValue={config.tagline} onBlur={(e) => updateConfig({ tagline: e.target.value })} /></Field>
              <div className="grid gap-3 sm:grid-cols-3">
                {(['navy', 'brand', 'accent', 'gold', 'canvas', 'line'] as const).map((key) => (
                  <label key={key} className="block">
                    <span className="mb-1.5 block text-[13px] font-medium capitalize text-ink">{key}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        defaultValue={config.theme[key]}
                        onChange={(e) => updateConfig({ theme: { ...config.theme, [key]: e.target.value } })}
                        className="h-9 w-12 cursor-pointer rounded-lg border border-line bg-surface p-1"
                        aria-label={`${key} colour`}
                      />
                      <code className="text-[12px] text-ink-muted">{config.theme[key]}</code>
                    </div>
                  </label>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Terminology" subtitle="Every user-visible noun that differs between organisations." action={<Type size={16} className="text-ink-soft" />} />
            <CardBody className="grid gap-4 pt-2 sm:grid-cols-2">
              {(['benefit', 'wallet', 'employee', 'employees', 'unitSingular', 'clinic', 'clinics', 'programme', 'journey', 'pulse', 'currency'] as const).map((key) => (
                <Field key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())}>
                  <Input defaultValue={t[key]} onBlur={(e) => updateConfig({ terminology: { ...t, [key]: e.target.value } })} />
                </Field>
              ))}
            </CardBody>
          </Card>
        </div>
      ) : null}

      {tab === 'policy' ? (
        <div className="space-y-4">
          <Card>
            <CardHeader title={policy.name} subtitle="Changing the entitlement re-derives every wallet in the organisation immediately." />
            <CardBody className="grid gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-4">
              <Field label={`Annual entitlement (${t.currency})`}>
                <Input type="number" min="0" step="50" defaultValue={policy.annualAmount} onBlur={(e) => setPolicy({ annualAmount: Number(e.target.value) || policy.annualAmount })} />
              </Field>
              <Field label="Benefit period">
                <Select defaultValue={policy.period} onChange={(e) => setPolicy({ period: e.target.value as typeof policy.period })}>
                  <option value="calendar-year">Calendar year</option>
                  <option value="financial-year">Financial year</option>
                </Select>
              </Field>
              <Field label={`Auto-approve under (${t.currency})`} hint="Verified automatically at submission.">
                <Input type="number" min="0" step="10" defaultValue={policy.approval.autoApproveUnder} onBlur={(e) => setPolicy({ approval: { ...policy.approval, autoApproveUnder: Number(e.target.value) || 0 } })} />
              </Field>
              <Field label="Minimum service (months)">
                <Input type="number" min="0" defaultValue={policy.eligibility.minMonthsService} onBlur={(e) => setPolicy({ eligibility: { ...policy.eligibility, minMonthsService: Number(e.target.value) || 0 } })} />
              </Field>
              <div className="sm:col-span-2 lg:col-span-4">
                <Toggle
                  checked={policy.approval.allowExcess}
                  onChange={(next) => setPolicy({ approval: { ...policy.approval, allowExcess: next } })}
                  label="Allow spend beyond entitlement under a policy exception"
                  description="When off, a clinic cannot submit above the available balance and must refer the employee to HR first."
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Alert thresholds" subtitle="Bands are per policy, per tenant. Employees see the message; the exception flag decides whether HR and Finance are drawn in." />
            <CardBody className="pt-2">
              <Table className="min-w-[760px]">
                <thead><tr><Th>At %</Th><Th>Level</Th><Th>Label</Th><Th>Employee message</Th><Th align="center">Raises exception</Th></tr></thead>
                <tbody>
                  {policy.thresholds.map((th, i) => (
                    <tr key={th.level}>
                      <Td>
                        <Input
                          type="number" min="1" max="200" defaultValue={th.at} className="h-8 w-20 py-1 text-[13px]"
                          onBlur={(e) => {
                            const next = [...policy.thresholds];
                            next[i] = { ...th, at: Number(e.target.value) || th.at };
                            setThresholds(next.sort((a, b) => a.at - b.at));
                          }}
                        />
                      </Td>
                      <Td><Badge tone={th.level === 'policy' ? 'risk' : th.level === 'important' ? 'warn' : th.level === 'reminder' ? 'accent' : 'info'}>{th.level}</Badge></Td>
                      <Td>
                        <Input defaultValue={th.label} className="h-8 w-32 py-1 text-[13px]" onBlur={(e) => { const next = [...policy.thresholds]; next[i] = { ...th, label: e.target.value }; setThresholds(next); }} />
                      </Td>
                      <Td>
                        <Textarea
                          defaultValue={th.employeeMessage}
                          className="min-h-[64px] w-full min-w-[300px] py-1.5 text-[12.5px]"
                          onBlur={(e) => { const next = [...policy.thresholds]; next[i] = { ...th, employeeMessage: e.target.value }; setThresholds(next); }}
                        />
                      </Td>
                      <Td align="center">
                        <input
                          type="checkbox" defaultChecked={th.raisesException} className="h-4 w-4 accent-[rgb(var(--c-brand))]"
                          aria-label={`Raise exception at ${th.at}%`}
                          onChange={(e) => { const next = [...policy.thresholds]; next[i] = { ...th, raisesException: e.target.checked }; setThresholds(next); }}
                        />
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <p className="mt-3 text-[12.5px] leading-relaxed text-ink-muted">
                Tokens available in messages: <code>{'{name}'}</code> <code>{'{used}'}</code> <code>{'{available}'}</code>{' '}
                <code>{'{pct}'}</code> <code>{'{benefit}'}</code>. Current entitlement is {formatMoney(policy.annualAmount, t.currency)}, so the
                90% band triggers at {formatMoney(policy.annualAmount * 0.9, t.currency)}.
              </p>
            </CardBody>
          </Card>
        </div>
      ) : null}

      {tab === 'modules' ? (
        <Card>
          <CardHeader title="Modules" subtitle="Feature flags per tenant. Disabling a module removes its navigation, its pages and its data from every dashboard." />
          <CardBody className="divide-y divide-line pt-2">
            {(Object.keys(config.modules) as ModuleKey[]).map((key) => (
              <Toggle
                key={key}
                checked={config.modules[key]}
                onChange={(next) => updateConfig({ modules: { ...config.modules, [key]: next } })}
                label={key.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())}
                description={moduleDescriptions[key]}
                disabled={key === 'medical-benefit'}
              />
            ))}
            <p className="pt-3 text-[12.5px] text-ink-muted">
              The medical benefit module is the platform&apos;s core and cannot be switched off.
            </p>
          </CardBody>
        </Card>
      ) : null}

      {tab === 'roles' ? (
        <Card>
          <CardHeader title="Permission matrix" subtitle="The capability list each role holds. This matrix is enforced in the data layer, not only in navigation — a role without a capability receives an empty result even on a direct URL." />
          <CardBody className="pt-2">
            <Table className="min-w-[820px]">
              <thead>
                <tr>
                  <Th>Capability</Th>
                  {(Object.keys(roleLabels) as RoleKey[]).map((r) => <Th key={r} align="center">{roleLabels[r]}</Th>)}
                </tr>
              </thead>
              <tbody>
                {roleMatrix().map((row) => (
                  <tr key={row.capability}>
                    <Td className="whitespace-nowrap font-medium">{row.capability}</Td>
                    {(Object.keys(roleLabels) as RoleKey[]).map((r) => (
                      <Td key={r} align="center">
                        {row.roles[r] ? <span className="text-ok" aria-label="allowed">●</span> : <span className="text-ink-soft/40" aria-label="not allowed">—</span>}
                      </Td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      ) : null}

      {tab === 'privacy' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader title="Aggregation floor" subtitle="The minimum group size before any organisational figure is displayed." />
            <CardBody className="space-y-4 pt-2">
              <Field label="Minimum group size" hint="Raising this suppresses more figures. Lowering it below 5 is not recommended for health-adjacent data.">
                <Input
                  type="number" min="1" max="50"
                  defaultValue={config.privacy.minimumAggregationGroup}
                  onBlur={(e) => updateConfig({ privacy: { ...config.privacy, minimumAggregationGroup: Number(e.target.value) || config.privacy.minimumAggregationGroup } })}
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-3">
                {(['transactions', 'wellbeing', 'audit'] as const).map((k) => (
                  <Field key={k} label={`${k} retention (months)`}>
                    <Input
                      type="number" min="1"
                      defaultValue={config.privacy.retentionMonths[k]}
                      onBlur={(e) => updateConfig({ privacy: { ...config.privacy, retentionMonths: { ...config.privacy.retentionMonths, [k]: Number(e.target.value) || config.privacy.retentionMonths[k] } } })}
                    />
                  </Field>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Consent purposes" subtitle="What employees may switch on or off, and the default position." />
            <CardBody className="space-y-3 pt-2">
              {config.privacy.optionalConsents.map((c) => (
                <div key={c.purpose} className="rounded-xl border border-line px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[13.5px] font-medium text-ink">{c.title}</p>
                    <Badge tone={c.defaultGranted ? 'ok' : 'muted'}>{c.defaultGranted ? 'On by default' : 'Off by default'}</Badge>
                  </div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">{c.description}</p>
                  <code className="mt-1.5 block text-[11.5px] text-ink-soft">{c.purpose}</code>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      ) : null}

      {tab === 'tenants' ? (
        <div className="space-y-4">
          <Card>
            <CardHeader title="Deployed tenants" subtitle="The same engine, configured per organisation. Switching here reloads the platform against that tenant's configuration and its own isolated dataset." />
            <CardBody className="grid gap-3 pt-2 sm:grid-cols-2">
              {tenantList.map((tn) => (
                <div key={tn.id} className={cn('rounded-2xl border p-4', tn.id === tenantId ? 'border-navy bg-navy/[0.03]' : 'border-line')}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display text-[16px] text-navy">{tn.productName}</p>
                      <p className="text-[12.5px] text-ink-muted">{tn.organisationName}</p>
                    </div>
                    {tn.id === tenantId ? <Badge tone="accent">Active</Badge> : null}
                  </div>
                  <dl className="mt-3 space-y-1 text-[12.5px] text-ink-muted">
                    <div className="flex justify-between"><dt>Entitlement</dt><dd className="text-ink">{tn.terminology.currency}{tn.policies[0].annualAmount.toLocaleString()}</dd></div>
                    <div className="flex justify-between"><dt>Thresholds</dt><dd className="text-ink">{tn.policies[0].thresholds.map((x) => `${x.at}%`).join(' · ')}</dd></div>
                    <div className="flex justify-between"><dt>{tn.terminology.unitPlural}</dt><dd className="text-ink">{tn.organisation.divisions.length}</dd></div>
                    <div className="flex justify-between"><dt>Modules on</dt><dd className="text-ink">{Object.values(tn.modules).filter(Boolean).length} of {Object.keys(tn.modules).length}</dd></div>
                    <div className="flex justify-between"><dt>Aggregation floor</dt><dd className="text-ink">{tn.privacy.minimumAggregationGroup}</dd></div>
                  </dl>
                  {tn.id !== tenantId ? (
                    <Button size="sm" variant="secondary" className="mt-3" onClick={() => switchTenant(tn.id)}>Switch to this tenant</Button>
                  ) : null}
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Demonstration data" subtitle={`${db.employees.length} fictional people, ${db.transactions.length} transactions, ${db.exceptions.length} exception cases.`} />
            <CardBody className="pt-2">
              <p className="text-[13px] leading-relaxed text-ink-muted">
                Regenerating rebuilds this tenant&apos;s dataset from its configuration seed. Configuration overrides made
                on this page are cleared at the same time.
              </p>
              <Button variant="secondary" className="mt-3" onClick={resetDemoData}>Regenerate demonstration data</Button>
            </CardBody>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

const moduleDescriptions: Record<ModuleKey, string> = {
  'medical-benefit': 'Entitlement, wallet, ledger and approval workflow. The platform core.',
  'panel-clinic': 'Clinic directory, clinic portal and eligibility verification.',
  'employee-wellbeing': 'Personal wellbeing vault, goals and the employee journey.',
  'health-screening': 'Screening programmes and personal screening records.',
  'activity-challenge': 'Movement and team challenge programme type.',
  'mental-wellbeing': 'Resilience and support programme type.',
  ergonomics: 'Ergonomics assessment programme type and its related signal.',
  'preventive-campaigns': 'Awareness and preventive campaign programme type.',
  'absenteeism-insights': 'MC and absence patterns in organisational analytics.',
  'wellness-rewards': 'Recognition and rewards for participation.',
  'esg-reporting': 'The ESG value dashboard and its evidence register.',
  'annual-wellbeing-report': 'The annual workforce wellbeing report template.',
  'wellbeing-pulse': 'The voluntary five-question pulse and its aggregate signal.',
  'intelligence-signals': 'Signal detection, insights and the intervention register.',
};
