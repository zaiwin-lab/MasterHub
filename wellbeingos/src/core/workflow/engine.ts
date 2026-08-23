/**
 * Configurable transaction workflow.
 *
 * The seven-step operating journey (VISIT → VERIFY → TRANSACT → UPDATE →
 * INFORM → MANAGE → LEARN) is expressed as a state machine whose gates come
 * from BenefitPolicy.approval, so a tenant changes the workflow by changing
 * policy configuration rather than code.
 */
import type { BenefitPolicy, MedicalTransaction, RoleKey, TransactionStatus } from '@/core/domain/types';

export interface TransitionContext {
  policy: BenefitPolicy;
  actorRoles: RoleKey[];
  /** Balance available to the employee before this transaction is counted. */
  spendableBefore: number;
}

export interface Transition {
  action: 'verify' | 'approve' | 'reject' | 'pay' | 'reopen';
  to: TransactionStatus;
  label: string;
  requiresRemark?: boolean;
  tone: 'primary' | 'quiet' | 'danger';
}

const roleCan = (roles: RoleKey[], allowed: RoleKey[]) => roles.some((r) => allowed.includes(r));

export function availableTransitions(
  txn: MedicalTransaction,
  ctx: TransitionContext,
): Transition[] {
  const { policy, actorRoles } = ctx;
  const approver = roleCan(actorRoles, policy.approval.approverRoles);
  const out: Transition[] = [];

  switch (txn.status) {
    case 'submitted':
      if (approver)
        out.push(
          { action: 'verify', to: 'verified', label: 'Verify', tone: 'primary' },
          { action: 'reject', to: 'rejected', label: 'Reject', requiresRemark: true, tone: 'danger' },
        );
      break;
    case 'verified':
      if (approver)
        out.push(
          { action: 'approve', to: 'approved', label: 'Approve', tone: 'primary' },
          { action: 'reject', to: 'rejected', label: 'Reject', requiresRemark: true, tone: 'danger' },
        );
      break;
    case 'approved':
      if (roleCan(actorRoles, ['finance']))
        out.push({ action: 'pay', to: 'paid', label: 'Mark as paid', tone: 'primary' });
      break;
    case 'rejected':
      if (approver) out.push({ action: 'reopen', to: 'submitted', label: 'Reopen', tone: 'quiet' });
      break;
    case 'paid':
    default:
      break;
  }
  return out;
}

/** Applied at submission time — decides whether the entry skips manual verification. */
export function autoApprovable(amount: number, policy: BenefitPolicy): boolean {
  return amount <= policy.approval.autoApproveUnder;
}

/** Gate used by the clinic portal before a visit may be recorded. */
export function eligibilityDecision(input: {
  eligible: boolean;
  employeeStatus: string;
  spendable: number;
  amount: number;
  policy: BenefitPolicy;
}): { allowed: boolean; requiresPolicyRoute: boolean; reason: string } {
  if (!input.eligible || input.employeeStatus === 'exited')
    return { allowed: false, requiresPolicyRoute: false, reason: 'Not eligible under the current benefit policy.' };
  if (input.amount <= input.spendable)
    return { allowed: true, requiresPolicyRoute: false, reason: 'Within available balance.' };
  if (input.policy.approval.allowExcess)
    return {
      allowed: true,
      requiresPolicyRoute: true,
      reason: 'Above available balance — will be routed under the policy exception workflow.',
    };
  return {
    allowed: false,
    requiresPolicyRoute: true,
    reason: 'Above available balance and this policy does not permit excess. Refer to HR before proceeding.',
  };
}

export const statusLabels: Record<TransactionStatus, string> = {
  submitted: 'Submitted',
  verified: 'Verified',
  approved: 'Approved',
  rejected: 'Rejected',
  paid: 'Paid',
};

export const statusTone: Record<TransactionStatus, 'ok' | 'warn' | 'risk' | 'info' | 'muted'> = {
  submitted: 'info',
  verified: 'warn',
  approved: 'ok',
  rejected: 'risk',
  paid: 'muted',
};
