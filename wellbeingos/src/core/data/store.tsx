'use client';

/**
 * Application state container.
 *
 * The MVP persists the seeded dataset in the browser so that the full journey —
 * submit, verify, approve, wallet update, exception, audit — is genuinely
 * exercisable end to end without a hosted backend. Mutations are funnelled
 * through named actions that also write audit events, mirroring the server-side
 * service boundary described in docs/ARCHITECTURE.md.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { TenantConfig } from '@/core/config/tenant';
import { getTenant, defaultTenantId } from '@/tenants/registry';
import { buildDataset, type Dataset } from './seed';
import type { Session } from '@/core/access/permissions';
import type {
  AuditEvent,
  Consent,
  ExceptionCase,
  MedicalTransaction,
  PrivacyZone,
  RoleKey,
  TransactionStatus,
  WellbeingCheckIn,
  WellbeingGoal,
  WellbeingProgramme,
} from '@/core/domain/types';
import { autoApprovable } from '@/core/workflow/engine';

const STORAGE_PREFIX = 'wellbeingos:v1';

interface PersistedState {
  db: Dataset;
  overrides: Partial<TenantConfig> | null;
}

interface StoreValue {
  ready: boolean;
  tenantId: string;
  config: TenantConfig;
  db: Dataset;
  session: Session | null;
  signIn: (userId: string) => void;
  signOut: () => void;
  switchTenant: (tenantId: string) => void;
  resetDemoData: () => void;
  updateConfig: (patch: Partial<TenantConfig>) => void;
  actions: Actions;
}

export interface Actions {
  submitTransaction: (input: {
    employeeId: string;
    clinicId: string;
    date: string;
    serviceCategory: string;
    amount: number;
    mcDays: number;
    notes?: string;
    supportingRecord?: string;
    excess?: boolean;
  }) => MedicalTransaction;
  advanceTransaction: (id: string, to: TransactionStatus, action: string, remarks?: string) => void;
  updateException: (id: string, patch: Partial<ExceptionCase>) => void;
  commentOnException: (id: string, body: string) => void;
  saveCheckIn: (input: Omit<WellbeingCheckIn, 'id' | 'tenantId' | 'employeeId'>) => void;
  setGoalProgress: (id: string, progress: number) => void;
  addGoal: (input: { title: string; metric: string; target: number; dueDate: string }) => void;
  setConsent: (purpose: string, granted: boolean) => void;
  registerForProgramme: (programmeId: string) => void;
  withdrawFromProgramme: (programmeId: string) => void;
  saveProgramme: (input: Partial<WellbeingProgramme> & { id?: string }) => void;
  saveClinic: (input: Partial<Dataset['clinics'][number]> & { id?: string }) => void;
  markNotificationsRead: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function persist(id: string, next: Dataset, nextOverrides: Partial<TenantConfig> | null) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}:data:${id}`, JSON.stringify({ db: next, overrides: nextOverrides }));
  } catch {
    /* storage full or unavailable — the session continues in memory */
  }
}

const nowISO = () => new Date().toISOString();
const rid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [tenantId, setTenantId] = useState<string>(defaultTenantId);
  const [db, setDb] = useState<Dataset | null>(null);
  const [overrides, setOverrides] = useState<Partial<TenantConfig> | null>(null);
  /**
   * Persistence needs the latest overrides even when a data mutation and a
   * configuration change happen in the same tick, so the authoritative copy
   * lives in a ref and state exists only to trigger a re-render.
   */
  const overridesRef = useRef<Partial<TenantConfig> | null>(null);
  const applyOverrides = useCallback((next: Partial<TenantConfig> | null) => {
    overridesRef.current = next;
    setOverrides(next);
  }, []);
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  // Load (or generate) the dataset for the active tenant on the client only,
  // which keeps server rendering free of seeded data and hydration-safe.
  useEffect(() => {
    const activeTenant = localStorage.getItem(`${STORAGE_PREFIX}:tenant`) ?? defaultTenantId;
    setTenantId(activeTenant);
    load(activeTenant);
    const raw = localStorage.getItem(`${STORAGE_PREFIX}:session:${activeTenant}`);
    if (raw) {
      try {
        setSession(JSON.parse(raw) as Session);
      } catch {
        /* corrupt session — start signed out */
      }
    }
    setReady(true);
    // Runs once on mount: the active tenant is read from storage, not from props.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = useCallback((id: string) => {
    const key = `${STORAGE_PREFIX}:data:${id}`;
    const raw = typeof window === 'undefined' ? null : localStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as PersistedState;
        if (parsed.db?.tenantId === id && parsed.db.periodYear === new Date().getFullYear()) {
          setDb(parsed.db);
          applyOverrides(parsed.overrides ?? null);
          return;
        }
      } catch {
        /* fall through to a fresh seed */
      }
    }
    const fresh = buildDataset(getTenant(id));
    setDb(fresh);
    applyOverrides(null);
    persist(id, fresh, null);
  }, [applyOverrides]);

  const config = useMemo<TenantConfig>(() => {
    const base = getTenant(tenantId);
    return overrides ? { ...base, ...overrides } : base;
  }, [tenantId, overrides]);

  const commit = useCallback((mutate: (draft: Dataset) => void) => {
    setDb((current) => {
      if (!current) return current;
      const draft: Dataset = JSON.parse(JSON.stringify(current));
      mutate(draft);
      persist(current.tenantId, draft, overridesRef.current);
      return draft;
    });
  }, []);

  const audit = (draft: Dataset, s: Session | null, e: { action: string; entity: string; entityId?: string; zone: PrivacyZone; summary: string }) => {
    const event: AuditEvent = {
      id: rid('aud'),
      tenantId: draft.tenantId,
      at: nowISO(),
      actorId: s?.userId ?? 'system',
      actorRole: (s?.roles[0] ?? 'admin') as RoleKey,
      ...e,
    };
    draft.audit.unshift(event);
  };

  const signIn = useCallback(
    (userId: string) => {
      if (!db) return;
      const user = db.users.find((u) => u.id === userId);
      if (!user) return;
      const next: Session = {
        userId: user.id,
        tenantId: user.tenantId,
        name: user.name,
        roles: user.roles,
        employeeId: user.employeeId,
        clinicId: user.clinicId,
      };
      setSession(next);
      localStorage.setItem(`${STORAGE_PREFIX}:session:${db.tenantId}`, JSON.stringify(next));
      commit((draft) => {
        audit(draft, next, { action: 'session.signIn', entity: 'User', entityId: user.id, zone: 'zone1', summary: `${user.name} signed in as ${user.roles.join(', ')}.` });
      });
    },
    [db, commit],
  );

  const signOut = useCallback(() => {
    if (db) localStorage.removeItem(`${STORAGE_PREFIX}:session:${db.tenantId}`);
    setSession(null);
  }, [db]);

  const switchTenant = useCallback((id: string) => {
    localStorage.setItem(`${STORAGE_PREFIX}:tenant`, id);
    setTenantId(id);
    setSession(null);
    load(id);
  }, [load]);

  const resetDemoData = useCallback(() => {
    const fresh = buildDataset(getTenant(tenantId));
    setDb(fresh);
    applyOverrides(null);
    persist(tenantId, fresh, null);
  }, [tenantId, applyOverrides]);

  const updateConfig = useCallback(
    (patch: Partial<TenantConfig>) => {
      applyOverrides({ ...(overridesRef.current ?? {}), ...patch });
      commit((draft) => {
        // Policy edits must reach the ledger's entitlement records immediately.
        if (patch.policies) {
          draft.policies = patch.policies.map((p) => ({ ...p, tenantId: draft.tenantId }));
          const amount = patch.policies[0]?.annualAmount;
          if (typeof amount === 'number') {
            draft.benefits = draft.benefits.map((b) => ({
              ...b,
              entitlement: draft.employees.find((e) => e.id === b.employeeId)?.eligible ? amount : 0,
            }));
          }
        }
        audit(draft, session, { action: 'tenant.configured', entity: 'TenantConfiguration', zone: 'zone1', summary: `Updated ${Object.keys(patch).join(', ')}.` });
      });
    },
    [applyOverrides, commit, session],
  );

  const actions = useMemo<Actions>(
    () => ({
      submitTransaction: (input) => {
        const policy = (db?.policies ?? [])[0];
        const auto = policy ? autoApprovable(input.amount, policy) : false;
        const txn: MedicalTransaction = {
          id: rid('txn'),
          tenantId: tenantId,
          employeeId: input.employeeId,
          clinicId: input.clinicId,
          date: input.date,
          periodYear: new Date(input.date).getFullYear(),
          serviceCategory: input.serviceCategory,
          amount: Math.round(input.amount * 100) / 100,
          reference: `${db?.clinics.find((c) => c.id === input.clinicId)?.code ?? 'PC'}/${new Date(input.date).getFullYear()}/${Math.floor(Math.random() * 90000 + 10000)}`,
          mcDays: input.mcDays,
          status: auto ? 'verified' : 'submitted',
          notes: input.notes,
          supportingRecord: input.supportingRecord,
          excess: input.excess,
          createdBy: session?.userId ?? 'system',
          createdAt: nowISO(),
          updatedAt: nowISO(),
        };
        commit((draft) => {
          draft.transactions.unshift(txn);
          if (auto) {
            draft.approvals.unshift({
              id: rid('apr'), tenantId: draft.tenantId, transactionId: txn.id,
              actorId: session?.userId ?? 'system', actorRole: 'clinic', action: 'verified', at: nowISO(),
              remarks: `Auto-verified: at or below the policy auto-approval line.`,
            });
          }
          if (input.excess) {
            draft.exceptions.unshift({
              id: rid('exc'),
              reference: `EXC-${draft.periodYear}-${Math.floor(Math.random() * 9000 + 1000)}`,
              tenantId: draft.tenantId,
              category: 'policy-exception',
              title: `Transaction above available balance — ${txn.reference}`,
              detail: 'Submitted above the available balance and routed under the policy exception workflow.',
              subjectEmployeeId: txn.employeeId,
              subjectTransactionId: txn.id,
              priority: 'high',
              status: 'open',
              ownerRole: 'hr',
              openedAt: nowISO(),
              updatedAt: nowISO(),
              comments: [],
            });
          }
          const employee = draft.employees.find((e) => e.id === txn.employeeId);
          draft.notifications.unshift({
            id: rid('ntf'), tenantId: draft.tenantId, audience: { employeeId: txn.employeeId },
            level: 'info', title: 'New clinic visit recorded',
            body: `${txn.serviceCategory} at ${draft.clinics.find((c) => c.id === txn.clinicId)?.name ?? 'a panel clinic'} — ${txn.amount.toFixed(2)}.`,
            at: nowISO(), read: false, href: '/app/claims',
          });
          audit(draft, session, {
            action: 'transaction.submitted', entity: 'MedicalTransaction', entityId: txn.id, zone: 'zone1',
            summary: `Recorded a ${txn.serviceCategory} visit for ${employee?.staffNo ?? txn.employeeId}.`,
          });
        });
        return txn;
      },

      advanceTransaction: (id, to, action, remarks) => {
        commit((draft) => {
          const txn = draft.transactions.find((t) => t.id === id);
          if (!txn) return;
          txn.status = to;
          txn.updatedAt = nowISO();
          draft.approvals.unshift({
            id: rid('apr'), tenantId: draft.tenantId, transactionId: id,
            actorId: session?.userId ?? 'system', actorRole: (session?.roles[0] ?? 'hr') as RoleKey,
            action: action as never, at: nowISO(), remarks,
          });
          // Any pending-approval exception on this entry is closed by the decision.
          draft.exceptions
            .filter((e) => e.subjectTransactionId === id && e.category === 'pending-approval' && e.status !== 'resolved')
            .forEach((e) => {
              e.status = 'resolved';
              e.resolvedAt = nowISO();
              e.updatedAt = nowISO();
              e.resolution = `Closed automatically when the transaction was ${to}.`;
            });
          audit(draft, session, {
            action: `transaction.${action}`, entity: 'MedicalTransaction', entityId: id, zone: 'zone1',
            summary: `${action} ${txn.reference}${remarks ? ` — ${remarks}` : ''}.`,
          });
        });
      },

      updateException: (id, patch) => {
        commit((draft) => {
          const exc = draft.exceptions.find((e) => e.id === id);
          if (!exc) return;
          Object.assign(exc, patch, { updatedAt: nowISO() });
          if (patch.status === 'resolved' || patch.status === 'dismissed') exc.resolvedAt = nowISO();
          audit(draft, session, {
            action: 'exception.updated', entity: 'ExceptionCase', entityId: id, zone: 'zone1',
            summary: `${exc.reference} set to ${exc.status}.`,
          });
        });
      },

      commentOnException: (id, body) => {
        commit((draft) => {
          const exc = draft.exceptions.find((e) => e.id === id);
          if (!exc) return;
          exc.comments.push({ id: rid('cmt'), actorId: session?.userId ?? 'system', at: nowISO(), body });
          exc.updatedAt = nowISO();
          audit(draft, session, { action: 'exception.commented', entity: 'ExceptionCase', entityId: id, zone: 'zone1', summary: `Comment added to ${exc.reference}.` });
        });
      },

      saveCheckIn: (input) => {
        if (!session?.employeeId) return;
        commit((draft) => {
          draft.checkIns.unshift({ ...input, id: rid('chk'), tenantId: draft.tenantId, employeeId: session.employeeId! });
          audit(draft, session, {
            action: 'wellbeing.checkIn', entity: 'WellbeingCheckIn', zone: 'zone2',
            summary: 'Employee recorded a wellbeing pulse in their personal vault.',
          });
        });
      },

      setGoalProgress: (id, progress) => {
        commit((draft) => {
          const goal = draft.goals.find((g) => g.id === id);
          if (!goal) return;
          goal.progress = progress;
          if (progress >= goal.target) goal.status = 'achieved';
          audit(draft, session, { action: 'wellbeing.goalUpdated', entity: 'WellbeingGoal', entityId: id, zone: 'zone2', summary: 'Employee updated a personal goal.' });
        });
      },

      addGoal: (input) => {
        if (!session?.employeeId) return;
        commit((draft) => {
          const goal: WellbeingGoal = {
            id: rid('goal'), tenantId: draft.tenantId, employeeId: session.employeeId!,
            title: input.title, metric: input.metric, target: input.target, progress: 0,
            dueDate: input.dueDate, status: 'active',
          };
          draft.goals.push(goal);
          audit(draft, session, { action: 'wellbeing.goalCreated', entity: 'WellbeingGoal', entityId: goal.id, zone: 'zone2', summary: 'Employee created a personal goal.' });
        });
      },

      setConsent: (purpose, granted) => {
        if (!session?.employeeId) return;
        commit((draft) => {
          const existing = draft.consents.find((c) => c.employeeId === session.employeeId && c.purpose === purpose);
          if (existing) {
            existing.granted = granted;
            existing.updatedAt = nowISO();
          } else {
            const consent: Consent = {
              id: rid('con'), tenantId: draft.tenantId, employeeId: session.employeeId!,
              purpose: purpose as Consent['purpose'], granted, version: '1.0', updatedAt: nowISO(),
            };
            draft.consents.push(consent);
          }
          // Withdrawing aggregation consent removes past contributions from Zone 3.
          if (purpose === 'aggregate-wellbeing') {
            draft.checkIns
              .filter((c) => c.employeeId === session.employeeId)
              .forEach((c) => {
                c.shareAggregate = granted;
              });
          }
          audit(draft, session, {
            action: 'consent.updated', entity: 'Consent', zone: 'zone2',
            summary: `Consent "${purpose}" ${granted ? 'granted' : 'withdrawn'} by the employee.`,
          });
        });
      },

      registerForProgramme: (programmeId) => {
        if (!session?.employeeId) return;
        commit((draft) => {
          if (draft.participation.some((p) => p.programmeId === programmeId && p.employeeId === session.employeeId)) return;
          draft.participation.push({
            id: rid('par'), tenantId: draft.tenantId, programmeId, employeeId: session.employeeId!,
            registeredAt: nowISO(), status: 'registered',
          });
          const prog = draft.programmes.find((p) => p.id === programmeId);
          audit(draft, session, {
            action: 'programme.registered', entity: 'ProgrammeParticipation', entityId: programmeId, zone: 'zone3',
            summary: `Employee registered for ${prog?.name ?? programmeId}.`,
          });
        });
      },

      withdrawFromProgramme: (programmeId) => {
        if (!session?.employeeId) return;
        commit((draft) => {
          draft.participation = draft.participation.filter(
            (p) => !(p.programmeId === programmeId && p.employeeId === session.employeeId),
          );
          audit(draft, session, { action: 'programme.withdrawn', entity: 'ProgrammeParticipation', entityId: programmeId, zone: 'zone3', summary: 'Employee withdrew from a programme.' });
        });
      },

      saveProgramme: (input) => {
        commit((draft) => {
          if (input.id) {
            const prog = draft.programmes.find((p) => p.id === input.id);
            if (prog) Object.assign(prog, input);
            audit(draft, session, { action: 'programme.updated', entity: 'WellbeingProgramme', entityId: input.id, zone: 'zone3', summary: `Updated programme ${prog?.name ?? input.id}.` });
          } else {
            const prog: WellbeingProgramme = {
              id: rid('prg'), tenantId: draft.tenantId,
              name: input.name ?? 'Untitled programme',
              category: input.category ?? 'Preventive Campaign',
              description: input.description ?? '',
              targetGroup: input.targetGroup ?? 'All staff',
              startDate: input.startDate ?? new Date().toISOString().slice(0, 10),
              endDate: input.endDate ?? new Date().toISOString().slice(0, 10),
              capacity: input.capacity ?? 50,
              registrationMode: input.registrationMode ?? 'open',
              organiser: input.organiser ?? 'Wellbeing Team',
              status: input.status ?? 'open',
              relatedSignalCode: input.relatedSignalCode,
              outcomeIndicator: input.outcomeIndicator,
            };
            draft.programmes.push(prog);
            if (prog.relatedSignalCode) {
              draft.interventions.push({
                id: rid('int'), tenantId: draft.tenantId, signalCode: prog.relatedSignalCode,
                programmeId: prog.id, title: `Response: ${prog.name}`, status: 'running',
                owner: prog.organiser, startedAt: prog.startDate,
                measureNote: prog.outcomeIndicator ? `Measured on: ${prog.outcomeIndicator}.` : undefined,
                decidedBy: session?.name,
              });
            }
            audit(draft, session, { action: 'programme.created', entity: 'WellbeingProgramme', entityId: prog.id, zone: 'zone3', summary: `Created programme ${prog.name}.` });
          }
        });
      },

      saveClinic: (input) => {
        commit((draft) => {
          if (input.id) {
            const clinic = draft.clinics.find((c) => c.id === input.id);
            if (clinic) Object.assign(clinic, input);
            audit(draft, session, { action: 'clinic.updated', entity: 'Clinic', entityId: input.id, zone: 'zone1', summary: `Updated panel clinic ${clinic?.name ?? input.id}.` });
          } else {
            const id = rid('cl');
            draft.clinics.push({
              id, tenantId: draft.tenantId,
              code: input.code ?? `PC-${draft.clinics.length + 1}`,
              name: input.name ?? 'New panel clinic',
              location: input.location ?? '—',
              address: input.address ?? '',
              phone: input.phone ?? '',
              hours: input.hours ?? '',
              services: input.services ?? ['General consultation'],
              panelStatus: input.panelStatus ?? 'pending',
              agreementExpiry: input.agreementExpiry ?? new Date().toISOString().slice(0, 10),
            });
            audit(draft, session, { action: 'clinic.created', entity: 'Clinic', entityId: id, zone: 'zone1', summary: `Added panel clinic ${input.name ?? id}.` });
          }
        });
      },

      markNotificationsRead: () => {
        commit((draft) => {
          draft.notifications.forEach((n) => {
            const mine = n.audience.employeeId
              ? n.audience.employeeId === session?.employeeId
              : n.audience.roles?.some((r) => session?.roles.includes(r));
            if (mine) n.read = true;
          });
        });
      },
    }),
    [commit, db, session, tenantId],
  );

  const value: StoreValue = {
    ready: ready && !!db,
    tenantId,
    config,
    db: db as Dataset,
    session,
    signIn,
    signOut,
    switchTenant,
    resetDemoData,
    updateConfig,
    actions,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
