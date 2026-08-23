/**
 * Deterministic demonstration dataset.
 *
 * Everything here is fictional. Shape comes entirely from TenantConfig, so a
 * new tenant gets a coherent demo dataset without touching this file.
 */
import { mulberry32, pick, int, chance, money, type Rng } from './random';
import { firstNames, lastNames, clinicNames } from './names';
import type { TenantConfig } from '@/core/config/tenant';
import type {
  Approval,
  AuditEvent,
  BenefitPolicy,
  Clinic,
  Consent,
  Employee,
  EmployeeBenefit,
  ExceptionCase,
  InsightSignal,
  Intervention,
  MedicalTransaction,
  Notification,
  OrganisationUnit,
  ProgrammeParticipation,
  ScreeningRecord,
  User,
  WellbeingCheckIn,
  WellbeingGoal,
  WellbeingProgramme,
} from '@/core/domain/types';
import { computeWallet } from '@/core/domain/benefit';

export interface Dataset {
  tenantId: string;
  generatedAt: string;
  referenceDate: string;
  periodYear: number;
  units: OrganisationUnit[];
  policies: BenefitPolicy[];
  employees: Employee[];
  benefits: EmployeeBenefit[];
  users: User[];
  clinics: Clinic[];
  transactions: MedicalTransaction[];
  approvals: Approval[];
  exceptions: ExceptionCase[];
  notifications: Notification[];
  checkIns: WellbeingCheckIn[];
  goals: WellbeingGoal[];
  programmes: WellbeingProgramme[];
  participation: ProgrammeParticipation[];
  screenings: ScreeningRecord[];
  consents: Consent[];
  signals: InsightSignal[];
  interventions: Intervention[];
  audit: AuditEvent[];
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
const isoT = (d: Date) => d.toISOString();

type Profile = 'light' | 'moderate' | 'high' | 'critical' | 'exhausted';

/** The persona whose story the executive demo follows. */
export const DEMO_EMPLOYEE_INDEX = 0;

/**
 * Pinned utilisation profiles for the head of the workforce list, so every
 * generated dataset contains the exception and recovery cases the platform is
 * built to handle. Employees beyond this list are randomised.
 */
const NARRATIVE_PROFILES: Record<number, Profile> = {
  1: 'exhausted', 2: 'exhausted', 3: 'exhausted',
  4: 'critical', 5: 'critical', 6: 'critical', 7: 'critical', 8: 'critical',
  9: 'high', 10: 'high', 11: 'high',
};

const profileTarget: Record<Profile, [number, number]> = {
  light: [0.02, 0.22],
  moderate: [0.25, 0.6],
  high: [0.62, 0.86],
  critical: [0.9, 0.99],
  exhausted: [1.02, 1.28],
};

export function buildDataset(config: TenantConfig): Dataset {
  const rng = mulberry32(config.seed.randomSeed);
  const tenantId = config.id;
  const now = new Date();
  const referenceDate = iso(now);
  const periodYear = now.getFullYear();
  const monthsElapsed = now.getMonth() + 1;

  // ---- Organisation structure -------------------------------------------
  const units: OrganisationUnit[] = [];
  config.organisation.divisions.forEach((div, i) => {
    const divId = `unit-d${i}`;
    units.push({ id: divId, tenantId, name: div.name, type: 'division' });
    div.departments.forEach((dep, j) => {
      units.push({ id: `unit-d${i}-${j}`, tenantId, name: dep, type: 'department', parentId: divId });
    });
  });
  const departments = units.filter((u) => u.type === 'department');

  const policies: BenefitPolicy[] = config.policies.map((p) => ({ ...p, tenantId }));
  const policy = policies[0];

  // ---- Clinics -----------------------------------------------------------
  const clinics: Clinic[] = Array.from({ length: config.seed.clinics }).map((_, i) => {
    const location = config.organisation.locations[i % config.organisation.locations.length];
    return {
      id: `cl-${i + 1}`,
      tenantId,
      code: `PC-${String(i + 1).padStart(3, '0')}`,
      name: `${clinicNames[i % clinicNames.length]} ${location}`,
      location,
      address: `${int(rng, 1, 88)}, Jalan ${pick(rng, ['Tun Ahmad Zaidi', 'Padungan', 'Satok', 'Green Road', 'Bandar Baru'])}, ${location}`,
      phone: `08${int(rng, 1, 9)}-${int(rng, 200, 899)} ${int(rng, 1000, 9999)}`,
      hours: pick(rng, ['Mon–Fri 8am–6pm, Sat 8am–1pm', 'Daily 8am–9pm', 'Mon–Sat 9am–5pm', '24 hours']),
      services: ['General consultation', 'Medication', ...(chance(rng, 0.4) ? ['Dental'] : []), ...(chance(rng, 0.3) ? ['Diagnostic / lab'] : []), ...(chance(rng, 0.25) ? ['Physiotherapy'] : [])],
      panelStatus: i === config.seed.clinics - 1 ? 'pending' : chance(rng, 0.08) ? 'suspended' : 'active',
      agreementExpiry: iso(new Date(periodYear + (chance(rng, 0.5) ? 0 : 1), int(rng, 0, 11), int(rng, 1, 28))),
    };
  });
  const activeClinics = clinics.filter((c) => c.panelStatus === 'active');

  // ---- Employees ---------------------------------------------------------
  const employees: Employee[] = [];
  const benefits: EmployeeBenefit[] = [];
  const profiles: Profile[] = [];

  for (let i = 0; i < config.seed.employees; i += 1) {
    const unit = departments[i % departments.length];
    const category =
      i === DEMO_EMPLOYEE_INDEX || NARRATIVE_PROFILES[i]
        ? 'Permanent'
        : pick(rng, config.organisation.employeeCategories);
    const name =
      i === DEMO_EMPLOYEE_INDEX ? 'Aina Rahman' : `${pick(rng, firstNames)} ${pick(rng, lastNames)}`;
    const joinYear = int(rng, periodYear - 18, periodYear);
    const employee: Employee = {
      id: `emp-${String(i + 1).padStart(4, '0')}`,
      tenantId,
      staffNo: `${config.organisationCode}${String(1000 + i)}`,
      name,
      unitId: unit.id,
      location: pick(rng, config.organisation.locations),
      category,
      grade: pick(rng, config.organisation.grades),
      joinDate: iso(new Date(joinYear, int(rng, 0, 11), int(rng, 1, 28))),
      status: i !== DEMO_EMPLOYEE_INDEX && chance(rng, 0.03) ? 'on-leave' : 'active',
      eligible: policy.eligibility.categories.includes(category),
      policyId: policy.id,
      ageBand: pick(rng, ['20–29', '30–39', '40–49', '50–59']),
      ...(i === DEMO_EMPLOYEE_INDEX ? {} : {}),
    };
    employees.push(employee);
    benefits.push({
      id: `ben-${employee.id}`,
      tenantId,
      employeeId: employee.id,
      policyId: policy.id,
      periodYear,
      entitlement: employee.eligible ? policy.annualAmount : 0,
      carriedForward: 0,
    });

    /**
     * Utilisation profile.
     *
     * The head of the list is pinned so the demonstration always carries the
     * cases the story needs — a persona in the reminder band, a few people over
     * entitlement for the recovery narrative, several approaching the policy
     * threshold. Relying on the random tail leaves those cases absent in some
     * seeds, which is exactly when a demonstration falls flat.
     */
    let profile: Profile;
    if (i === DEMO_EMPLOYEE_INDEX) profile = 'high';
    else if (NARRATIVE_PROFILES[i]) profile = NARRATIVE_PROFILES[i];
    else {
      const r = rng();
      profile = r < 0.34 ? 'light' : r < 0.72 ? 'moderate' : r < 0.9 ? 'high' : r < 0.97 ? 'critical' : 'exhausted';
    }
    profiles.push(profile);
  }

  // ---- Transaction ledger ------------------------------------------------
  const transactions: MedicalTransaction[] = [];
  const approvals: Approval[] = [];
  let txnSeq = 0;

  const hrUserId = 'usr-hr';
  const finUserId = 'usr-finance';

  employees.forEach((employee, i) => {
    if (!employee.eligible) return;
    const entitlement = policy.annualAmount;
    const [lo, hi] = profileTarget[profiles[i]];
    let target = entitlement * (lo + rng() * (hi - lo));
    // Persona is pinned so the demo narrative is stable.
    if (i === DEMO_EMPLOYEE_INDEX) target = entitlement * 0.78;

    let spent = 0;
    let guard = 0;
    while (spent < target && guard < 40) {
      guard += 1;
      const monthIndex = int(rng, 0, monthsElapsed - 1);
      const day = int(rng, 1, monthIndex === now.getMonth() ? Math.max(1, now.getDate()) : 28);
      const date = new Date(periodYear, monthIndex, day);
      const clinic = pick(rng, activeClinics);
      const category = weightedCategory(rng, config.serviceCategories);
      const remaining = target - spent;
      const amount = Math.min(
        remaining + (chance(rng, 0.2) ? money(rng, 20, 90) : 0),
        categoryAmount(rng, category),
      );
      if (amount < 12) break;
      txnSeq += 1;

      const isRecent = date > new Date(now.getTime() - 1000 * 60 * 60 * 24 * 21);
      let status: MedicalTransaction['status'] = 'paid';
      if (isRecent) {
        const r = rng();
        status = r < 0.25 ? 'submitted' : r < 0.4 ? 'verified' : r < 0.95 ? 'approved' : 'rejected';
      } else if (chance(rng, 0.03)) status = 'rejected';
      else if (chance(rng, 0.2)) status = 'approved';

      const createdAt = isoT(new Date(date.getTime() + 1000 * 60 * 60 * int(rng, 9, 17)));
      const txn: MedicalTransaction = {
        id: `txn-${String(txnSeq).padStart(5, '0')}`,
        tenantId,
        employeeId: employee.id,
        clinicId: clinic.id,
        date: iso(date),
        periodYear,
        serviceCategory: category,
        amount: Math.round(amount * 100) / 100,
        reference: `${clinic.code}/${periodYear}/${String(txnSeq).padStart(5, '0')}`,
        mcDays: category === 'General consultation' && chance(rng, 0.35) ? int(rng, 1, 3) : 0,
        status,
        createdBy: `usr-clinic-${clinic.id}`,
        createdAt,
        updatedAt: createdAt,
        notes: chance(rng, 0.12) ? pick(rng, ['Follow-up visit', 'Referred by panel clinic', 'Repeat medication', 'Post-treatment review']) : undefined,
      };
      transactions.push(txn);
      if (status !== 'submitted') {
        approvals.push({
          id: `apr-${txn.id}-v`,
          tenantId,
          transactionId: txn.id,
          actorId: hrUserId,
          actorRole: 'hr',
          action: 'verified',
          at: isoT(new Date(new Date(createdAt).getTime() + 1000 * 60 * 60 * 20)),
        });
      }
      if (status === 'approved' || status === 'paid') {
        approvals.push({
          id: `apr-${txn.id}-a`,
          tenantId,
          transactionId: txn.id,
          actorId: hrUserId,
          actorRole: 'hr',
          action: 'approved',
          at: isoT(new Date(new Date(createdAt).getTime() + 1000 * 60 * 60 * 30)),
        });
      }
      if (status === 'paid') {
        approvals.push({
          id: `apr-${txn.id}-p`,
          tenantId,
          transactionId: txn.id,
          actorId: finUserId,
          actorRole: 'finance',
          action: 'paid',
          at: isoT(new Date(new Date(createdAt).getTime() + 1000 * 60 * 60 * 24 * 9)),
        });
      }
      if (status === 'rejected') {
        approvals.push({
          id: `apr-${txn.id}-r`,
          tenantId,
          transactionId: txn.id,
          actorId: hrUserId,
          actorRole: 'hr',
          action: 'rejected',
          at: isoT(new Date(new Date(createdAt).getTime() + 1000 * 60 * 60 * 26)),
          remarks: pick(rng, ['Outside covered service categories', 'Duplicate of an earlier submission', 'Supporting record not attached']),
        });
        return;
      }
      // Only entitlement-consuming statuses count towards the profile target,
      // so a profile of 95% means 95% *approved* — the figure the bands use.
      if (status === 'approved' || status === 'paid') spent += amount;
    }
  });

  // A deliberate duplicate pair so the exception engine has something real to find.
  const dupSource = transactions.find((t) => t.status === 'approved' && t.amount > 80);
  if (dupSource) {
    txnSeq += 1;
    transactions.push({
      ...dupSource,
      id: `txn-${String(txnSeq).padStart(5, '0')}`,
      reference: `${dupSource.reference}-B`,
      status: 'submitted',
      createdAt: isoT(new Date(now.getTime() - 1000 * 60 * 60 * 30)),
      updatedAt: isoT(new Date(now.getTime() - 1000 * 60 * 60 * 30)),
    });
  }

  // ---- Users / personas --------------------------------------------------
  const persona = employees[DEMO_EMPLOYEE_INDEX];
  const users: User[] = [
    { id: 'usr-employee', tenantId, name: persona.name, email: `${slug(persona.name)}@${config.organisationCode.toLowerCase()}.demo`, roles: ['employee'], employeeId: persona.id, status: 'active' },
    { id: hrUserId, tenantId, name: 'Noraini Hassan', email: `hr@${config.organisationCode.toLowerCase()}.demo`, roles: ['hr'], status: 'active' },
    { id: finUserId, tenantId, name: 'Lim Chee Keong', email: `finance@${config.organisationCode.toLowerCase()}.demo`, roles: ['finance'], status: 'active' },
    { id: `usr-clinic-${activeClinics[0].id}`, tenantId, name: `${activeClinics[0].name} — front desk`, email: `clinic@${config.organisationCode.toLowerCase()}.demo`, roles: ['clinic'], clinicId: activeClinics[0].id, status: 'active' },
    { id: 'usr-wellbeing', tenantId, name: 'Sarina Abdullah', email: `wellbeing@${config.organisationCode.toLowerCase()}.demo`, roles: ['wellbeing'], status: 'active' },
    { id: 'usr-management', tenantId, name: `${config.shortName} Management`, email: `management@${config.organisationCode.toLowerCase()}.demo`, roles: ['management'], status: 'active' },
    { id: 'usr-admin', tenantId, name: 'System Administrator', email: `admin@${config.organisationCode.toLowerCase()}.demo`, roles: ['admin'], status: 'active' },
  ];

  // ---- Wellbeing programmes ---------------------------------------------
  const programmeBlueprints = [
    { name: 'Annual Health Screening', category: 'Health Screening', description: 'Voluntary screening at panel clinics covering basic health indicators.', outcome: 'Screening participation rate', signal: 'SIG-METAB' },
    { name: 'Workstation Ergonomics Assessment', category: config.programmeCategories.includes('Ergonomics') ? 'Ergonomics' : 'Preventive Campaign', description: 'Desk and field-vehicle posture assessment with follow-up adjustments.', outcome: 'Musculoskeletal-related visits', signal: 'SIG-MSK' },
    { name: '10,000 Steps Challenge', category: config.programmeCategories.find((c) => /Movement|Fitness/.test(c)) ?? 'Preventive Campaign', description: 'Eight-week team-based movement challenge across all locations.', outcome: 'Self-reported activity score', signal: 'SIG-ACT' },
    { name: 'Resilience at Work', category: config.programmeCategories.find((c) => /Resilience|Mental/.test(c)) ?? 'Preventive Campaign', description: 'Four short sessions on workload, recovery and support pathways.', outcome: 'Pulse workload score', signal: 'SIG-PULSE' },
    { name: 'Healthy Plate Awareness', category: 'Nutrition Awareness', description: 'Canteen and pantry nutrition awareness with simple swaps.', outcome: 'Nutrition awareness reach', signal: undefined },
    { name: 'Respiratory Health Awareness', category: 'Preventive Campaign', description: 'Awareness and environmental review following a seasonal pattern.', outcome: 'Respiratory-related visits', signal: 'SIG-RESP' },
    { name: 'Preventive Dental Campaign', category: 'Preventive Campaign', description: 'Dental check-up drive with panel clinic partners.', outcome: 'Dental preventive visits', signal: undefined },
    { name: 'Mid-Year Wellbeing Week', category: 'Health Screening', description: 'A week of screening booths, talks and clinic engagement.', outcome: 'Participation rate', signal: undefined },
  ];

  const programmes: WellbeingProgramme[] = programmeBlueprints.map((b, i) => {
    const startMonth = int(rng, 0, Math.max(0, monthsElapsed - 1));
    const start = new Date(periodYear, startMonth, int(rng, 1, 20));
    const end = new Date(periodYear, Math.min(11, startMonth + int(rng, 1, 3)), int(rng, 1, 27));
    const status: WellbeingProgramme['status'] =
      end < now ? 'completed' : start <= now ? 'running' : i === programmeBlueprints.length - 1 ? 'draft' : 'open';
    return {
      id: `prg-${i + 1}`,
      tenantId,
      name: b.name,
      category: b.category,
      description: b.description,
      targetGroup: pick(rng, ['All staff', 'All eligible staff', 'Office-based staff', 'Field operations staff', 'All locations']),
      startDate: iso(start),
      endDate: iso(end),
      capacity: int(rng, 40, 220),
      registrationMode: pick(rng, ['open', 'open', 'invite', 'nominated'] as const),
      organiser: pick(rng, ['Wellbeing Team', 'Human Resources', 'Wellbeing Team & Panel Clinics']),
      status,
      relatedSignalCode: b.signal,
      outcomeIndicator: b.outcome,
    };
  });

  const participation: ProgrammeParticipation[] = [];
  // Engagement is concentrated: a minority of staff join most things, and most
  // staff join occasionally. Independent per-programme odds would put almost
  // everyone in at least one programme, which is not what take-up looks like.
  const engagement = new Map(employees.map((e) => [e.id, chance(rng, 0.38) ? 0.42 : 0.05]));
  programmes.forEach((prog) => {
    if (prog.status === 'draft') return;
    const isScreening = prog.category === 'Health Screening';
    const appetite = isScreening ? 2.1 : 0.55 + rng() * 0.6;
    employees.forEach((emp) => {
      if (!chance(rng, Math.min(0.85, (engagement.get(emp.id) ?? 0.05) * appetite))) return;
      const registeredAt = isoT(new Date(new Date(prog.startDate).getTime() - 1000 * 60 * 60 * 24 * int(rng, 1, 14)));
      const status: ProgrammeParticipation['status'] =
        prog.status === 'completed'
          ? pick(rng, ['completed', 'completed', 'attended', 'withdrawn'] as const)
          : pick(rng, ['registered', 'registered', 'attended'] as const);
      participation.push({
        id: `par-${prog.id}-${emp.id}`,
        tenantId,
        programmeId: prog.id,
        employeeId: emp.id,
        registeredAt,
        status,
        feedbackScore: status === 'completed' ? int(rng, 3, 5) : undefined,
      });
    });
  });

  // Guarantee the persona has a visible programme history.
  const openProg = programmes.find((p) => p.status === 'running' || p.status === 'open');
  if (openProg && !participation.some((p) => p.programmeId === openProg.id && p.employeeId === persona.id)) {
    participation.push({
      id: `par-${openProg.id}-${persona.id}`,
      tenantId,
      programmeId: openProg.id,
      employeeId: persona.id,
      registeredAt: isoT(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 12)),
      status: 'registered',
    });
  }

  // ---- Screening ---------------------------------------------------------
  // Every screening programme produces attendance records, not just the first.
  const screeningProgrammes = programmes.filter((p) => p.category === 'Health Screening');
  const screenings: ScreeningRecord[] = screeningProgrammes.flatMap((prog) =>
    participation
      .filter((p) => p.programmeId === prog.id)
      .map((p) => ({
        id: `scr-${p.id}`,
        tenantId,
        employeeId: p.employeeId,
        programmeId: p.programmeId,
        date: prog.startDate,
        attended: p.status !== 'withdrawn' && chance(rng, 0.82),
        personalSummary:
          'All basic indicators within the range explained at your screening. Keep to your usual routine and follow up with your own doctor if anything changes.',
        shareWithWellbeingTeam: chance(rng, 0.4),
      })),
  );

  // ---- Consent -----------------------------------------------------------
  const consents: Consent[] = [];
  employees.forEach((emp) => {
    config.privacy.optionalConsents.forEach((c) => {
      consents.push({
        id: `con-${emp.id}-${c.purpose}`,
        tenantId,
        employeeId: emp.id,
        purpose: c.purpose as Consent['purpose'],
        granted: emp.id === persona.id ? c.defaultGranted : chance(rng, c.defaultGranted ? 0.82 : 0.35),
        version: '1.0',
        updatedAt: isoT(new Date(periodYear, int(rng, 0, Math.max(0, monthsElapsed - 1)), int(rng, 1, 28))),
      });
    });
  });

  // ---- Wellbeing pulse (Zone 2) -----------------------------------------
  const checkIns: WellbeingCheckIn[] = [];
  if (config.modules['wellbeing-pulse']) {
    employees.forEach((emp) => {
      const shares = consents.find((c) => c.employeeId === emp.id && c.purpose === 'aggregate-wellbeing')?.granted ?? false;
      const engaged = emp.id === persona.id || chance(rng, 0.45);
      if (!engaged) return;
      const months = Math.min(6, monthsElapsed);
      for (let m = months - 1; m >= 0; m -= 1) {
        if (!chance(rng, 0.75)) continue;
        const d = new Date(periodYear, now.getMonth() - m, int(rng, 3, 26));
        if (d > now) continue;
        // Gentle deterioration through the year gives the demo a real signal to find.
        const drift = (months - m) / months;
        checkIns.push({
          id: `chk-${emp.id}-${m}`,
          tenantId,
          employeeId: emp.id,
          date: iso(d),
          energy: clamp(int(rng, 2, 5) - (drift > 0.6 ? 1 : 0), 1, 5),
          stress: clamp(int(rng, 2, 4) + (drift > 0.6 ? 1 : 0), 1, 5),
          activity: clamp(int(rng, 1, 4), 1, 5),
          workplace: clamp(int(rng, 3, 5), 1, 5),
          support: clamp(int(rng, 3, 5), 1, 5),
          shareAggregate: shares,
        });
      }
    });
  }

  // ---- Personal goals (Zone 2) ------------------------------------------
  const goals: WellbeingGoal[] = [
    { id: `goal-${persona.id}-1`, tenantId, employeeId: persona.id, title: 'Walk 8,000 steps on working days', metric: 'days met this month', target: 18, progress: 11, dueDate: iso(new Date(periodYear, now.getMonth(), 28)), status: 'active' },
    { id: `goal-${persona.id}-2`, tenantId, employeeId: persona.id, title: 'Complete annual health screening', metric: 'completed', target: 1, progress: 0, dueDate: iso(new Date(periodYear, 11, 15)), status: 'active' },
  ];

  // ---- Exceptions (generated from the data, not hand-placed) ------------
  const exceptions: ExceptionCase[] = [];
  let excSeq = 0;
  const newException = (e: Omit<ExceptionCase, 'id' | 'reference' | 'tenantId' | 'comments'> & { comments?: ExceptionCase['comments'] }): ExceptionCase => {
    excSeq += 1;
    return {
      ...e,
      id: `exc-${String(excSeq).padStart(4, '0')}`,
      reference: `EXC-${periodYear}-${String(excSeq).padStart(4, '0')}`,
      tenantId,
      comments: e.comments ?? [],
    };
  };

  employees.forEach((emp) => {
    const wallet = computeWallet(
      transactions.filter((t) => t.employeeId === emp.id),
      benefits.find((b) => b.employeeId === emp.id)?.entitlement ?? 0,
      periodYear,
    );
    const crossed = [...policy.thresholds].sort((a, b) => b.at - a.at).find((t) => wallet.utilisationPct >= t.at && t.raisesException);
    if (!crossed) return;
    const exhausted = wallet.utilisationPct >= 100;
    exceptions.push(
      newException({
        category: exhausted ? 'benefit-exhausted' : 'threshold-approaching',
        title: exhausted
          ? `${emp.name} — entitlement fully utilised`
          : `${emp.name} — ${Math.round(wallet.utilisationPct)}% of entitlement used`,
        detail: exhausted
          ? `Approved utilisation of ${wallet.approved.toFixed(2)} against an entitlement of ${wallet.entitlement.toFixed(2)}. Policy route required before further visits are accepted.`
          : `Approved utilisation has passed the ${crossed.at}% threshold with ${monthsElapsed} of 12 months elapsed.`,
        subjectEmployeeId: emp.id,
        priority: exhausted ? 'high' : 'medium',
        status: chance(rng, 0.45) ? 'in-progress' : 'open',
        ownerRole: 'hr',
        ownerUserId: hrUserId,
        openedAt: isoT(new Date(now.getTime() - 1000 * 60 * 60 * 24 * int(rng, 1, 40))),
        updatedAt: isoT(new Date(now.getTime() - 1000 * 60 * 60 * 24 * int(rng, 0, 5))),
      }),
    );
    if (exhausted && wallet.excess > 0) {
      exceptions.push(
        newException({
          category: 'recovery-case',
          title: `${emp.name} — potential recovery of ${wallet.excess.toFixed(2)}`,
          detail: 'Utilisation exceeds entitlement. Confirm whether the excess is covered under a policy exception or is recoverable.',
          subjectEmployeeId: emp.id,
          priority: 'high',
          status: 'open',
          ownerRole: 'finance',
          ownerUserId: finUserId,
          openedAt: isoT(new Date(now.getTime() - 1000 * 60 * 60 * 24 * int(rng, 1, 20))),
          updatedAt: isoT(new Date(now.getTime() - 1000 * 60 * 60 * 24 * int(rng, 0, 3))),
        }),
      );
    }
  });

  // Duplicate submissions
  const seen = new Map<string, MedicalTransaction>();
  transactions.forEach((t) => {
    const key = `${t.employeeId}|${t.clinicId}|${t.date}|${t.amount}`;
    const prior = seen.get(key);
    if (prior) {
      exceptions.push(
        newException({
          category: 'duplicate-submission',
          title: `Possible duplicate — ${t.reference}`,
          detail: `Matches ${prior.reference} on the same day, clinic and amount. Confirm before approval.`,
          subjectEmployeeId: t.employeeId,
          subjectTransactionId: t.id,
          priority: 'medium',
          status: 'open',
          ownerRole: 'hr',
          openedAt: t.createdAt,
          updatedAt: t.createdAt,
        }),
      );
    } else seen.set(key, t);
  });

  // Unusual transaction values
  const amounts = transactions.map((t) => t.amount).sort((a, b) => a - b);
  const p95 = amounts[Math.floor(amounts.length * 0.97)] ?? 500;
  transactions
    .filter((t) => t.amount > p95 && t.status !== 'rejected')
    .slice(0, 4)
    .forEach((t) => {
      const emp = employees.find((e) => e.id === t.employeeId);
      exceptions.push(
        newException({
          category: 'unusual-transaction',
          title: `Value above the usual range — ${t.reference}`,
          detail: `${t.serviceCategory} at ${t.amount.toFixed(2)} sits above the 97th percentile for this period. Verify supporting record.`,
          subjectEmployeeId: emp?.id,
          subjectTransactionId: t.id,
          priority: 'low',
          status: chance(rng, 0.5) ? 'resolved' : 'open',
          ownerRole: 'finance',
          openedAt: t.createdAt,
          updatedAt: t.updatedAt,
          resolution: undefined,
        }),
      );
    });

  // Ageing approvals
  transactions
    .filter((t) => t.status === 'submitted')
    .slice(0, 5)
    .forEach((t) => {
      exceptions.push(
        newException({
          category: 'pending-approval',
          title: `Awaiting verification — ${t.reference}`,
          detail: 'Submitted by the panel clinic and not yet verified. Turnaround target is two working days.',
          subjectTransactionId: t.id,
          subjectEmployeeId: t.employeeId,
          priority: 'low',
          status: 'open',
          ownerRole: 'hr',
          openedAt: t.createdAt,
          updatedAt: t.createdAt,
        }),
      );
    });

  // Eligibility mismatch
  const ineligibleWithTxn = employees.find((e) => !e.eligible);
  if (ineligibleWithTxn) {
    exceptions.push(
      newException({
        category: 'eligibility-mismatch',
        title: `${ineligibleWithTxn.name} — category not covered by the active policy`,
        detail: `Employee category "${ineligibleWithTxn.category}" is outside the eligibility list of ${policy.name}. Confirm the correct policy or update the record.`,
        subjectEmployeeId: ineligibleWithTxn.id,
        priority: 'medium',
        status: 'open',
        ownerRole: 'hr',
        openedAt: isoT(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 9)),
        updatedAt: isoT(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 9)),
      }),
    );
  }

  // ---- Organisational signals -------------------------------------------
  const eligibleCount = employees.filter((e) => e.eligible).length || 1;
  const screenedCount = new Set(screenings.filter((r) => r.attended).map((r) => r.employeeId)).size;
  const signals = buildSignals(config, {
    transactions, checkIns, employees, periodYear, monthsElapsed, now,
    screeningPct: Math.round((screenedCount / eligibleCount) * 1000) / 10,
  });

  const interventions: Intervention[] = [
    {
      id: 'int-1',
      tenantId,
      signalCode: 'SIG-MSK',
      programmeId: programmes.find((p) => p.relatedSignalCode === 'SIG-MSK')?.id,
      title: 'Ergonomics assessment for office-based and field roles',
      status: 'measuring',
      owner: 'Wellbeing Team',
      startedAt: iso(new Date(periodYear, Math.max(0, now.getMonth() - 3), 5)),
      measureNote: 'Musculoskeletal-related visits reviewed monthly against the pre-programme baseline.',
      baseline: 18,
      latest: 13,
      decidedBy: 'Wellbeing Committee — minuted decision',
    },
    {
      id: 'int-2',
      tenantId,
      signalCode: 'SIG-ACT',
      programmeId: programmes.find((p) => p.relatedSignalCode === 'SIG-ACT')?.id,
      title: 'Movement challenge across all locations',
      status: 'running',
      owner: 'Wellbeing Team',
      startedAt: iso(new Date(periodYear, Math.max(0, now.getMonth() - 1), 12)),
      measureNote: 'Self-reported activity score, aggregated only.',
      baseline: 2.4,
      latest: 2.7,
      decidedBy: 'Wellbeing Committee — minuted decision',
    },
    {
      id: 'int-3',
      tenantId,
      signalCode: 'SIG-RESP',
      title: 'Environmental review of the Bintulu operations floor',
      status: 'approved',
      owner: 'Facilities & Wellbeing',
      startedAt: iso(new Date(periodYear, Math.max(0, now.getMonth()), 2)),
      measureNote: 'Awaiting facilities report before a preventive campaign is scheduled.',
      decidedBy: 'Management review — pending facilities input',
    },
  ];

  // ---- Notifications -----------------------------------------------------
  const notifications: Notification[] = [
    { id: 'ntf-1', tenantId, audience: { employeeId: persona.id }, level: 'reminder', title: 'Benefit utilisation update', body: 'You have used 78% of your entitlement for this period.', at: isoT(new Date(now.getTime() - 1000 * 60 * 60 * 26)), read: false, href: '/app/benefit' },
    { id: 'ntf-2', tenantId, audience: { employeeId: persona.id }, level: 'info', title: 'Screening places open', body: 'Annual health screening has places available at your location.', at: isoT(new Date(now.getTime() - 1000 * 60 * 60 * 72)), read: false, href: '/app/programmes' },
    { id: 'ntf-3', tenantId, audience: { roles: ['hr'] }, level: 'important', title: 'Exception queue', body: `${exceptions.filter((e) => e.status === 'open').length} open exceptions require attention.`, at: isoT(new Date(now.getTime() - 1000 * 60 * 60 * 5)), read: false, href: '/app/exceptions' },
    { id: 'ntf-4', tenantId, audience: { roles: ['finance'] }, level: 'reminder', title: 'Recovery exposure', body: 'Recovery cases have been raised for staff above entitlement.', at: isoT(new Date(now.getTime() - 1000 * 60 * 60 * 9)), read: false, href: '/app/exceptions' },
  ];

  // ---- Audit trail -------------------------------------------------------
  const audit: AuditEvent[] = [
    { id: 'aud-1', tenantId, at: isoT(new Date(now.getTime() - 1000 * 60 * 60 * 3)), actorId: hrUserId, actorRole: 'hr', action: 'transaction.approved', entity: 'MedicalTransaction', zone: 'zone1', summary: 'Approved a panel clinic transaction after verification.' },
    { id: 'aud-2', tenantId, at: isoT(new Date(now.getTime() - 1000 * 60 * 60 * 20)), actorId: 'usr-management', actorRole: 'management', action: 'analytics.viewed', entity: 'ManagementDashboard', zone: 'zone3', summary: 'Viewed the organisational command centre (aggregated only).' },
    { id: 'aud-3', tenantId, at: isoT(new Date(now.getTime() - 1000 * 60 * 60 * 30)), actorId: 'usr-employee', actorRole: 'employee', action: 'consent.updated', entity: 'Consent', zone: 'zone2', summary: 'Employee updated a consent preference in the privacy centre.' },
    { id: 'aud-4', tenantId, at: isoT(new Date(now.getTime() - 1000 * 60 * 60 * 44)), actorId: 'usr-admin', actorRole: 'admin', action: 'tenant.configured', entity: 'TenantConfiguration', zone: 'zone1', summary: 'Updated alert thresholds under the active benefit policy.' },
    { id: 'aud-5', tenantId, at: isoT(new Date(now.getTime() - 1000 * 60 * 60 * 60)), actorId: 'usr-wellbeing', actorRole: 'wellbeing', action: 'programme.created', entity: 'WellbeingProgramme', zone: 'zone3', summary: 'Created a preventive programme linked to an organisational signal.' },
  ];

  return {
    tenantId,
    generatedAt: isoT(now),
    referenceDate,
    periodYear,
    units,
    policies,
    employees,
    benefits,
    users,
    clinics,
    transactions,
    approvals,
    exceptions,
    notifications,
    checkIns,
    goals,
    programmes,
    participation,
    screenings,
    consents,
    signals,
    interventions,
    audit,
  };
}

// ---------------------------------------------------------------------------

function buildSignals(
  config: TenantConfig,
  ctx: {
    transactions: MedicalTransaction[];
    checkIns: WellbeingCheckIn[];
    employees: Employee[];
    periodYear: number;
    monthsElapsed: number;
    now: Date;
    screeningPct: number;
  },
): InsightSignal[] {
  const tenantId = config.id;
  const detectedAt = isoT(ctx.now);
  const recentMonth = ctx.now.getMonth();
  const inMonth = (t: MedicalTransaction, m: number) => new Date(t.date).getMonth() === m;

  const physio = ctx.transactions.filter((t) => t.serviceCategory === 'Physiotherapy');
  const physioRecent = physio.filter((t) => inMonth(t, recentMonth) || inMonth(t, recentMonth - 1)).length;
  const physioPrior = physio.filter((t) => inMonth(t, recentMonth - 2) || inMonth(t, recentMonth - 3)).length;

  const consult = ctx.transactions.filter((t) => t.serviceCategory === 'General consultation');
  const consultRecent = consult.filter((t) => inMonth(t, recentMonth)).length;
  const consultPrior = consult.filter((t) => inMonth(t, recentMonth - 1)).length;

  const shared = ctx.checkIns.filter((c) => c.shareAggregate);
  const avg = (rows: WellbeingCheckIn[], key: 'activity' | 'stress' | 'energy') =>
    rows.length ? Math.round((rows.reduce((a, b) => a + b[key], 0) / rows.length) * 10) / 10 : 0;
  const half = Math.floor(shared.length / 2);
  const earlier = shared.slice(0, half);
  const later = shared.slice(half);

  const signals: InsightSignal[] = [
    {
      id: 'sig-msk', tenantId, code: 'SIG-MSK', title: 'Musculoskeletal-related utilisation rising',
      category: 'Physical health',
      observation: `Physiotherapy and related visits moved from ${physioPrior} to ${physioRecent} across the last two comparable periods.`,
      organisationalInsight: 'Consistent with workstation and manual-handling load rather than a clinical cluster.',
      recommendedResponse: 'Offer an ergonomics assessment programme for office-based and field roles.',
      severity: physioRecent > physioPrior ? 'attention' : 'watch',
      metricLabel: 'Musculoskeletal-related visits', current: physioRecent, previous: physioPrior, unit: 'count',
      periodLabel: 'Last 2 months vs previous 2', scope: 'Organisation-wide',
      populationSize: ctx.employees.length, detectedAt,
    },
    {
      id: 'sig-resp', tenantId, code: 'SIG-RESP', title: 'Seasonal respiratory pattern in general consultations',
      category: 'Environmental',
      observation: `General consultations moved from ${consultPrior} to ${consultRecent} month on month.`,
      organisationalInsight: 'Pattern concentrated in shared operational areas; consistent with air quality and seasonal haze rather than an individual issue.',
      recommendedResponse: 'Environmental review of shared areas, awareness communication and a screening opportunity.',
      severity: consultRecent > consultPrior * 1.15 ? 'attention' : 'watch',
      metricLabel: 'General consultations', current: consultRecent, previous: consultPrior, unit: 'count',
      periodLabel: 'This month vs last', scope: 'Operational locations',
      populationSize: ctx.employees.length, detectedAt,
    },
    {
      id: 'sig-act', tenantId, code: 'SIG-ACT', title: 'Self-reported physical activity is low',
      category: 'Lifestyle',
      observation: `Aggregated activity score of ${avg(shared, 'activity') || '—'} out of 5 across ${shared.length} consented responses.`,
      organisationalInsight: 'Low movement across sedentary roles — an organisational programme opportunity, not an individual concern.',
      recommendedResponse: 'Run a team-based movement challenge across all locations.',
      severity: 'watch',
      metricLabel: 'Activity score (1–5)', current: avg(later, 'activity'), previous: avg(earlier, 'activity'), unit: 'index',
      periodLabel: 'Recent vs earlier responses', scope: 'Consented respondents only',
      populationSize: shared.length, detectedAt,
    },
    {
      id: 'sig-pulse', tenantId, code: 'SIG-PULSE', title: 'Wellbeing pulse softening in the second half',
      category: 'Workload & support',
      observation: `Aggregated stress score moved from ${avg(earlier, 'stress')} to ${avg(later, 'stress')} out of 5.`,
      organisationalInsight: 'Consistent with workload concentration in the reporting cycle. No individual response is identifiable.',
      recommendedResponse: 'Workload review with heads of division and a short resilience programme.',
      severity: avg(later, 'stress') > avg(earlier, 'stress') ? 'priority' : 'watch',
      metricLabel: 'Stress score (1–5)', current: avg(later, 'stress'), previous: avg(earlier, 'stress'), unit: 'index',
      periodLabel: 'Recent vs earlier responses', scope: 'Consented respondents only',
      populationSize: shared.length, detectedAt,
    },
    {
      id: 'sig-metab', tenantId, code: 'SIG-METAB', title: 'Screening participation below target',
      category: 'Prevention',
      observation: `Screening attendance stands at ${ctx.screeningPct}% of eligible staff against a ${config.id === 'stidc' ? 50 : 40}% target for the period.`,
      organisationalInsight: 'Access and scheduling, rather than willingness, is the usual constraint at operational sites.',
      recommendedResponse: 'On-site screening sessions at regional offices and a reminder campaign.',
      severity: 'attention',
      metricLabel: 'Screening participation', current: ctx.screeningPct, previous: 0, unit: '%',
      periodLabel: 'Year to date', scope: 'Organisation-wide',
      populationSize: ctx.employees.length, detectedAt,
    },
  ];

  return config.modules['intelligence-signals'] ? signals : [];
}

function weightedCategory(rng: Rng, categories: string[]): string {
  const weights: Record<string, number> = {
    'General consultation': 44,
    Medication: 20,
    Dental: 12,
    Optical: 6,
    'Specialist referral': 7,
    'Diagnostic / lab': 6,
    Physiotherapy: 5,
  };
  const pool = categories.flatMap((c) => Array.from({ length: weights[c] ?? 8 }).map(() => c));
  return pick(rng, pool);
}

function categoryAmount(rng: Rng, category: string): number {
  switch (category) {
    case 'General consultation': return money(rng, 45, 130);
    case 'Medication': return money(rng, 25, 110);
    case 'Dental': return money(rng, 90, 380);
    case 'Optical': return money(rng, 150, 450);
    case 'Specialist referral': return money(rng, 180, 620);
    case 'Diagnostic / lab': return money(rng, 120, 480);
    case 'Physiotherapy': return money(rng, 100, 260);
    default: return money(rng, 40, 200);
  }
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, '.');
